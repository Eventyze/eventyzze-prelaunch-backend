"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = __importDefault(require("validator"));
const helpers_1 = require("../../helpers");
const utilities_1 = require("../../utilities");
const modelTypes_1 = require("../../types/modelTypes");
const uuid_1 = require("uuid");
const databaseTransactions_middleware_1 = __importDefault(require("../../middlewares/databaseTransactions.middleware"));
const repositories_1 = require("../../repositories");
const emailAuthResponses_1 = require("../../types/responseTypes/emailAuthResponses");
// import { StatusCodes } from '../../constants/statusCodes.constants';
const constants_1 = require("../../constants");
const response_utilities_1 = __importDefault(require("../../utilities/responseHandlers/response.utilities"));
const userRegisterWithEmailService = utilities_1.errorUtilities.withErrorHandling(async (userPayload) => {
    let { email, password } = userPayload;
    email = email.trim();
    if (!validator_1.default.isEmail(email)) {
        throw utilities_1.errorUtilities.createError(emailAuthResponses_1.EmailAuthResponses.INVALID_EMAIL, 400);
    }
    const existingUser = (await repositories_1.userRepositories.userRepositories.getOne({
        email,
    }));
    if (existingUser) {
        throw utilities_1.errorUtilities.createError(emailAuthResponses_1.EmailAuthResponses.ALREADY_EXISTING_USER, constants_1.StatusCodes.StatusCodes.CONFLICT);
    }
    const userId = (0, uuid_1.v4)();
    const { otp, expiresAt } = await helpers_1.generalHelpers.generateOtp();
    const otpId = (0, uuid_1.v4)();
    const otpPayload = {
        id: otpId,
        userId,
        otp,
        expiresAt,
        used: false,
    };
    const walletPayload = {
        id: (0, uuid_1.v4)(),
        ownerId: userId,
        walletType: modelTypes_1.Roles.User,
        totalBalance: 0,
    };
    const followersPayload = {
        id: (0, uuid_1.v4)(),
        userId,
        followers: [],
    };
    const followingsPayload = {
        id: (0, uuid_1.v4)(),
        userId,
        followings: [],
    };
    const userCreationPayload = {
        id: userId,
        email,
        password: await helpers_1.generalHelpers.hashPassword(password.trim()),
        eventyzzeId: "",
        provider: modelTypes_1.SignupProvider.Email,
        otp: {
            otp,
            otpId,
            expiresAt,
        },
        role: modelTypes_1.Roles.User,
    };
    const operations = [
        async (transaction) => {
            await repositories_1.userRepositories.userRepositories.create(userCreationPayload, transaction);
        },
        async (transaction) => {
            await repositories_1.walletRepositories.walletRepositories.create(walletPayload, transaction);
        },
        async (transaction) => {
            await repositories_1.folowersRepositories.followersRepositories.create(followersPayload, transaction);
        },
        async (transaction) => {
            await repositories_1.followingsRepositories.followingsRepositories.create(followingsPayload, transaction);
        },
        async (transaction) => {
            await repositories_1.otpRepositories.otpRpositories.create(otpPayload, transaction);
        },
    ];
    await databaseTransactions_middleware_1.default.performTransaction(operations);
    const user = await repositories_1.userRepositories.userRepositories.getOne({
        id: userId,
    });
    await utilities_1.mailUtilities.sendMail(email, constants_1.EmailConstants.generateAuthMailMessages().OTP(otp), constants_1.EmailConstants.EmailAuthMailSubjects.OTP);
    return response_utilities_1.default.handleServicesResponse(constants_1.StatusCodes.StatusCodes.CREATED, emailAuthResponses_1.EmailAuthResponses.SUCCESFUL_CREATION, user);
});
const userVerifiesOtp = utilities_1.errorUtilities.withErrorHandling(async (userPayload) => {
    const { otp, email } = userPayload;
    const projection = [constants_1.DatabaseConstants.DatabaseProjection.OTP, constants_1.DatabaseConstants.DatabaseProjection.ID, constants_1.DatabaseConstants.DatabaseProjection.ROLE, constants_1.DatabaseConstants.DatabaseProjection.EMAIL];
    const user = await repositories_1.userRepositories.userRepositories.getOne({ email: email.trim() }, projection);
    if (!user) {
        throw utilities_1.errorUtilities.createError(emailAuthResponses_1.EmailAuthResponses.NOT_FOUND, constants_1.StatusCodes.StatusCodes.NOT_FOUND);
    }
    const otpFinder = await repositories_1.otpRepositories.otpRpositories.getOne({
        id: user.otp.otpId,
        otp,
    });
    if (!otpFinder || otpFinder.used) {
        throw utilities_1.errorUtilities.createError(emailAuthResponses_1.EmailAuthResponses.INVALID_OTP, constants_1.StatusCodes.StatusCodes.BAD_REQUEST);
    }
    const verify = await helpers_1.generalHelpers.verifyOtp(otpFinder);
    if (!verify) {
        throw utilities_1.errorUtilities.createError(emailAuthResponses_1.EmailAuthResponses.EXPIRED_OTP, constants_1.StatusCodes.StatusCodes.BAD_REQUEST);
    }
    const tokenPayload = {
        id: user.id,
        email: user.email,
        role: user.role,
    };
    const accessToken = await helpers_1.generalHelpers.generateTokens(tokenPayload, "2h");
    const refreshToken = await helpers_1.generalHelpers.generateTokens(tokenPayload, "30d");
    const operations = [
        async (transaction) => {
            await repositories_1.otpRepositories.otpRpositories.updateOne({ id: otpFinder.id }, { used: true }, transaction);
        },
        async (transaction) => {
            await repositories_1.userRepositories.userRepositories.updateOne({ email }, { otp: null, isVerified: true }, transaction);
        },
    ];
    await databaseTransactions_middleware_1.default.performTransaction(operations);
    const mainUser = await repositories_1.userRepositories.userRepositories.getOne({
        email,
    });
    await utilities_1.mailUtilities.sendMail(mainUser.email, constants_1.EmailConstants.generateAuthMailMessages().ACCOUNT_VERIFIED(), constants_1.EmailConstants.EmailAuthMailSubjects.ACCOUNT);
    return response_utilities_1.default.handleServicesResponse(constants_1.StatusCodes.StatusCodes.OK, emailAuthResponses_1.EmailAuthResponses.VERIFIED_ACCOUNT, { user: mainUser, accessToken, refreshToken });
});
const userLogin = utilities_1.errorUtilities.withErrorHandling(async (loginPayload) => {
    const { email, password, deviceId } = loginPayload;
    const projection = [
        constants_1.DatabaseConstants.DatabaseProjection.PASSWORD,
        constants_1.DatabaseConstants.DatabaseProjection.EMAIL,
        constants_1.DatabaseConstants.DatabaseProjection.ID,
        constants_1.DatabaseConstants.DatabaseProjection.ROLE,
        constants_1.DatabaseConstants.DatabaseProjection.VERIFIED,
        constants_1.DatabaseConstants.DatabaseProjection.BLACKLISTED,
        constants_1.DatabaseConstants.DatabaseProjection.DEVICEID,
        constants_1.DatabaseConstants.DatabaseProjection.REFRESH_TOKEN,
        constants_1.DatabaseConstants.DatabaseProjection.INITIAL_SETUP_DONE,
        constants_1.DatabaseConstants.DatabaseProjection.FULL_NAME,
        constants_1.DatabaseConstants.DatabaseProjection.PROVIDER,
    ];
    const filter = { email: email.trim() };
    const existingUser = await repositories_1.userRepositories.userRepositories.getOne(filter, projection);
    if (!existingUser) {
        throw utilities_1.errorUtilities.createError(emailAuthResponses_1.EmailAuthResponses.NOT_FOUND, constants_1.StatusCodes.StatusCodes.NOT_FOUND);
    }
    if (existingUser.provider !== modelTypes_1.SignupProvider.Email) {
        throw utilities_1.errorUtilities.createError(emailAuthResponses_1.EmailAuthResponses.WRONG_LOGIN_METHOD, constants_1.StatusCodes.StatusCodes.BAD_REQUEST);
    }
    if (!existingUser.isVerified) {
        return response_utilities_1.default.handleServicesResponse(constants_1.StatusCodes.StatusCodes.FORBIDDEN, emailAuthResponses_1.EmailAuthResponses.UNVERIFIED_ACCOUNT, { user: existingUser });
    }
    if (existingUser.isBlacklisted) {
        throw utilities_1.errorUtilities.createError(emailAuthResponses_1.EmailAuthResponses.BLOCKED_ACCOUNT, constants_1.StatusCodes.StatusCodes.BAD_REQUEST);
    }
    const verifyPassword = await helpers_1.generalHelpers.validatePassword(password.trim(), existingUser.password);
    if (!verifyPassword) {
        throw utilities_1.errorUtilities.createError(emailAuthResponses_1.EmailAuthResponses.INCORRECT_PASSWORD, constants_1.StatusCodes.StatusCodes.BAD_REQUEST);
    }
    if (existingUser.activeDeviceId && existingUser.activeDeviceId !== deviceId) {
        throw utilities_1.errorUtilities.createError(emailAuthResponses_1.EmailAuthResponses.ALREADY_LOGGED_IN, constants_1.StatusCodes.StatusCodes.CONFLICT);
    }
    const tokenPayload = {
        id: existingUser.id,
        email: existingUser.email,
        role: existingUser.role,
    };
    const accessToken = await helpers_1.generalHelpers.generateTokens(tokenPayload, "2h");
    const refreshToken = await helpers_1.generalHelpers.generateTokens(tokenPayload, "30d");
    let mailMessage = "";
    let mailSubject = "";
    const dateDetails = helpers_1.generalHelpers.dateFormatter(new Date());
    if (!existingUser.refreshToken || !existingUser.isInitialProfileSetupDone) {
        mailMessage = `${constants_1.EmailConstants.EmailAuthMailSubjects.WELCOME} ${existingUser.fullName ? existingUser.fullName : ""}! ${constants_1.EmailConstants.generateAuthMailMessages().NEW_USER_LOGIN()}`;
        mailSubject = `${constants_1.EmailConstants.EmailAuthMailSubjects.WELCOME} ${existingUser.fullName ? existingUser.fullName : ""}`;
    }
    else {
        mailSubject = constants_1.EmailConstants.EmailAuthMailSubjects.LOGIN_ACTIVITY;
        mailMessage = constants_1.EmailConstants.generateAuthMailMessages().EXISTING_USER_LOGIN(existingUser.fullName, dateDetails.date, dateDetails.time);
    }
    existingUser.refreshToken = refreshToken;
    existingUser.activeDeviceId = deviceId;
    await repositories_1.userRepositories.userRepositories.updateOne({ email }, { refreshToken: refreshToken, activeDeviceId: deviceId });
    const newExistingUser = await repositories_1.userRepositories.userRepositories.getOne(filter);
    const userWithoutPassword = await repositories_1.userRepositories.userRepositories.extractUserDetails(newExistingUser);
    await utilities_1.mailUtilities.sendMail(existingUser.email, mailMessage, mailSubject);
    return response_utilities_1.default.handleServicesResponse(constants_1.StatusCodes.StatusCodes.OK, emailAuthResponses_1.EmailAuthResponses.WELCOME_BACK, { user: userWithoutPassword, accessToken, refreshToken });
});
const userResendsOtpService = utilities_1.errorUtilities.withErrorHandling(async (resendPayload) => {
    const { email } = resendPayload;
    const user = await repositories_1.userRepositories.userRepositories.getOne({ email }, [constants_1.DatabaseConstants.DatabaseProjection.EMAIL, constants_1.DatabaseConstants.DatabaseProjection.ID, constants_1.DatabaseConstants.DatabaseProjection.OTP, constants_1.DatabaseConstants.DatabaseProjection.VERIFIED]);
    if (!user) {
        return response_utilities_1.default.handleServicesResponse(constants_1.StatusCodes.StatusCodes.NOT_FOUND, emailAuthResponses_1.EmailAuthResponses.NOT_FOUND);
    }
    if (user.isVerified) {
        return response_utilities_1.default.handleServicesResponse(constants_1.StatusCodes.StatusCodes.BAD_REQUEST, emailAuthResponses_1.EmailAuthResponses.ALREADY_VERIFIED);
    }
    const otpDetails = user.otp;
    if (new Date(otpDetails.expiresAt) > new Date()) {
        await utilities_1.mailUtilities.sendMail(email, constants_1.EmailConstants.generateAuthMailMessages().OTP(otpDetails.otp), constants_1.EmailConstants.EmailAuthMailSubjects.OTP);
        return response_utilities_1.default.handleServicesResponse(constants_1.StatusCodes.StatusCodes.OK, emailAuthResponses_1.EmailAuthResponses.OTP_RESENT);
    }
    const { otp, expiresAt } = await helpers_1.generalHelpers.generateOtp();
    const otpId = (0, uuid_1.v4)();
    const otpPayload = {
        id: otpId,
        userId: user.id,
        otp,
        expiresAt,
        used: false,
    };
    const userUpdatePayload = {
        otp: {
            otp,
            otpId,
            expiresAt,
        },
    };
    const operations = [
        async (transaction) => {
            await repositories_1.otpRepositories.otpRpositories.create(otpPayload, transaction);
        },
        async (transaction) => {
            await repositories_1.userRepositories.userRepositories.updateOne({ id: user.id }, userUpdatePayload, transaction);
        },
    ];
    await databaseTransactions_middleware_1.default.performTransaction(operations);
    await utilities_1.mailUtilities.sendMail(email, constants_1.EmailConstants.generateAuthMailMessages().OTP(otp), constants_1.EmailConstants.EmailAuthMailSubjects.OTP);
    return response_utilities_1.default.handleServicesResponse(constants_1.StatusCodes.StatusCodes.OK, emailAuthResponses_1.EmailAuthResponses.OTP_RESENT);
});
const userLogoutService = utilities_1.errorUtilities.withErrorHandling(async (logoutPayload) => {
    const { email } = logoutPayload;
    const user = await repositories_1.userRepositories.userRepositories.getOne({ email });
    if (user) {
        await repositories_1.userRepositories.userRepositories.updateOne({ email }, { activeDeviceId: null });
    }
    return response_utilities_1.default.handleServicesResponse(constants_1.StatusCodes.StatusCodes.OK, emailAuthResponses_1.EmailAuthResponses.LOGOUT_MESSAGE);
});
// const adminRegistrationService = errorUtilities.withErrorHandling(async (userPayload: Record<string, any>) => {
//     const responseHandler: ResponseDetails = {
//       statusCode: 0,
//       message: "",
//     };
//     const { name, email, password, phone } = userPayload;
//     if (!validator.isMobilePhone(phone, "en-NG")) {
//       throw errorUtilities.createError("Invalid phone number", 400);
//     }
//     if (!validator.isEmail(email)) {
//       throw errorUtilities.createError("Invalid email", 400);
//     }
//     const existingAdmin = await userDatabase.userDatabaseHelper.getOne({
//       email,
//     });
//     if (existingAdmin) {
//       throw errorUtilities.createError("Admin already exists with this email", 400);
//     }
//     const payload = {
//       name,
//       email,
//       password: await generalHelpers.hashPassword(password),
//       phone,
//       role: "Admin",
//       isVerified: true,
//     };
//     const newUser = await userDatabase.userDatabaseHelper.create(payload);
//     const userWithoutPassword = await userDatabase.userDatabaseHelper.extractUserDetails(newUser)
//     delete userWithoutPassword.refreshToken
//     responseHandler.statusCode = 201;
//     responseHandler.message = "Admin registered successfully";
//     responseHandler.data = userWithoutPassword;
//     return responseHandler;
// });
// const verifyUserAccount = errorUtilities.withErrorHandling(async (verificationToken: string): Promise<any> => {
//   const responseHandler: ResponseDetails = {
//     statusCode: 0,
//     message: "",
//   };
//   const verify: any = await generalHelpers.verifyRegistrationToken(verificationToken);
//   const user = await userDatabase.userDatabaseHelper.getOne({_id:verify.id});
//   if (!user) {
//     throw errorUtilities.createError("User not found", 404);
//   }
//   if (user.isVerified) {
//     throw errorUtilities.createError("User is already verified", 400);
//   }
//   await userDatabase.userDatabaseHelper.updateOne(
//     { _id:user._id }, { $set: { isVerified: true } }
//   )
//   responseHandler.statusCode = 200;
//   responseHandler.message = "User verified successfully";
//   return responseHandler;
// });
// const resendVerificationLinkService = errorUtilities.withErrorHandling(async (email: string): Promise<any> => {
//   const responseHandler: ResponseDetails = {
//     statusCode: 0,
//     message: "",
//   };
//   const user = await userDatabase.userDatabaseHelper.getOne({email});
//   if (!user) {
//     throw errorUtilities.createError(`${email} does not exist`, 404);
//   }
//   if (user.isVerified) {
//     throw errorUtilities.createError("User is already verified", 400);
//   }
//   const tokenPayload = {
//     id: user._id,
//     role: user.role,
//     email: user.email,
//   };
//   const verificationToken = await generalHelpers.generateTokens(
//     tokenPayload,
//     "1h"
//   );
//   await mailUtilities.sendMail(user.email, "Click the button below to verify your account", "PLEASE VERIFY YOUR ACCOUNT", `${USERS_APP_BASE_URL}/verification/${verificationToken}`);
//   const userWithoutPassword = await userDatabase.userDatabaseHelper.extractUserDetails(user)
//   delete userWithoutPassword.refreshToken
//   responseHandler.statusCode = 200;
//   responseHandler.message = "A verification mail has been sent to your account, please click on the link in the mail to verify your account. The link is valid for one hour only. Thank you.";
//   responseHandler.data = userWithoutPassword;
//   return responseHandler;
// })
exports.default = {
    userRegisterWithEmailService,
    userVerifiesOtp,
    userLogin,
    userResendsOtpService,
    userLogoutService,
    // adminRegistrationService,
    // userLogin,
    // verifyUserAccount,
    // resendVerificationLinkService
};
