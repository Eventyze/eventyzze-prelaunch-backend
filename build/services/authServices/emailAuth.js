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
const userRegisterWithEmailService = utilities_1.errorUtilities.withErrorHandling(async (userPayload) => {
    const responseHandler = {
        statusCode: 0,
        message: "",
        data: {},
        details: {},
        info: {},
    };
    let { email, password } = userPayload;
    email = email.trim();
    if (!validator_1.default.isEmail(email)) {
        throw utilities_1.errorUtilities.createError("Invalid email", 400);
    }
    const existingUser = await repositories_1.userRepositories.userRepositories.getOne({ email });
    if (existingUser) {
        throw utilities_1.errorUtilities.createError("User already exists with this email", 400);
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
        userId,
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
    await utilities_1.mailUtilities.sendMail(email, `Welcome to Eventyzze, your OTP is ${otp}, it expires in 5 minutes`, "Eventyzze OTP");
    responseHandler.statusCode = 201;
    responseHandler.message =
        "User created successfully, an OTP has been sent to your mail for email verification";
    responseHandler.data = user;
    return responseHandler;
});
const userVerifiesOtp = utilities_1.errorUtilities.withErrorHandling(async (userPayload) => {
    const responseHandler = {
        statusCode: 0,
        message: "",
        data: {},
        details: {},
        info: {},
    };
    const { otp, email } = userPayload;
    const projection = ["otp", "id", "role", "email"];
    const user = await repositories_1.userRepositories.userRepositories.getOne({ email: email.trim() }, projection);
    if (!user) {
        throw utilities_1.errorUtilities.createError("User not found", 404);
    }
    const otpFinder = await repositories_1.otpRepositories.otpRpositories.getOne({
        id: user.otp.otpId,
        otp,
    });
    if (!otpFinder || otpFinder.used) {
        throw utilities_1.errorUtilities.createError("Invalid OTP. Please try again or request a new OTP", 400);
    }
    const verify = await helpers_1.generalHelpers.verifyOtp(otpFinder);
    if (!verify) {
        throw utilities_1.errorUtilities.createError("OTP expired. Please request a new OTP", 400);
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
    await utilities_1.mailUtilities.sendMail(mainUser.email, `Welcome to Eventyzze, your email has been verified successfully. You can now login and start hosting your events 😊`, "Email Verified");
    responseHandler.statusCode = 200;
    responseHandler.message = "Account verified successfully";
    responseHandler.data = { user: mainUser, accessToken, refreshToken };
    return responseHandler;
});
const userLogin = utilities_1.errorUtilities.withErrorHandling(async (loginPayload) => {
    const responseHandler = {
        statusCode: 0,
        message: "",
        data: {},
        details: {},
        info: {},
    };
    const { email, password } = loginPayload;
    const projection = [
        "password",
        "id",
        "email",
        "isVerified",
        "isBlacklisted",
        "role",
        "numberOfEventsHosted",
        "numberOfEventsAttended",
        "bio",
        "userImage",
        "country",
        "subscriptionPlan",
        "interests",
        "noOfFollowers",
        "noOfFollowings",
        "refreshToken",
        "isInitialProfileSetupDone",
        "fullName",
        "userName",
        "accountStatus",
        "subScriptionId",
        "subscriptionDetails"
    ];
    const filter = { email: email.trim() };
    const existingUser = await repositories_1.userRepositories.userRepositories.getOne(filter, projection);
    if (!existingUser) {
        throw utilities_1.errorUtilities.createError(`User with email ${email} does not exist`, 404);
    }
    if (!existingUser.isVerified) {
        responseHandler.statusCode = 403;
        responseHandler.message = `${email} is not verified. Please request a new OTP to verify your account`;
        responseHandler.data = { user: existingUser };
        return responseHandler;
    }
    if (existingUser.isBlacklisted) {
        throw utilities_1.errorUtilities.createError(`Account Blocked, contact admin on eventyzze@gmail.com`, 400);
    }
    const verifyPassword = await helpers_1.generalHelpers.validatePassword(password.trim(), existingUser.password);
    if (!verifyPassword) {
        throw utilities_1.errorUtilities.createError("Incorrect Password", 400);
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
        mailMessage = `Welcome to Eventyzze ${existingUser.name ? existingUser.name : ""}! <br /><br />

          We're excited to have you on board. Eventyzze is your go-to platform for discovering, organizing, and sharing amazing events. Whether you're attending or hosting, we're here to make your experience seamless and enjoyable. <br /> <br />

          If you have any questions or need help getting started, feel free to reach out to our support team. We're always here to assist you. <br /> <br />

          Let's make some unforgettable moments together!`;
        mailSubject = `Welcome to Eventyzze ${existingUser.name ? existingUser.name : ""}`;
    }
    else {
        mailSubject = "Activity Detected on Your Account";
        mailMessage = `Hi ${existingUser.name ? existingUser.name : ""},
      There was a login to your account on ${dateDetails.date} by ${dateDetails.time}.<br /><br /> If you did not initiate this login, contact our support team to restrict your account. If it was you, please ignore.`;
    }
    existingUser.refreshToken = refreshToken;
    await existingUser.save();
    const userWithoutPassword = await repositories_1.userRepositories.userRepositories.extractUserDetails(existingUser);
    delete userWithoutPassword.refreshToken;
    await utilities_1.mailUtilities.sendMail(existingUser.email, mailMessage, mailSubject);
    responseHandler.statusCode = 200;
    responseHandler.message =
        "Welcome back" + `${existingUser.fullName ? existingUser.fullName : ""}`;
    responseHandler.data = {
        user: userWithoutPassword,
        accessToken: accessToken,
        refreshToken: refreshToken,
    };
    return responseHandler;
});
const userResendsOtpService = utilities_1.errorUtilities.withErrorHandling(async (resendPayload) => {
    const responseHandler = {
        statusCode: 0,
        message: "",
        data: {},
        details: {},
        info: {},
    };
    const { email } = resendPayload;
    const user = await repositories_1.userRepositories.userRepositories.getOne({ email }, ["email", "id", "otp", "isVerified"]);
    if (!user) {
        responseHandler.statusCode = 404;
        responseHandler.message = "User not found, please register";
        return responseHandler;
    }
    if (user.isVerified) {
        responseHandler.statusCode = 400;
        responseHandler.message = "Account already verified, please login";
        return responseHandler;
    }
    const otpDetails = user.otp;
    if (new Date(otpDetails.expiresAt) > new Date()) {
        await utilities_1.mailUtilities.sendMail(email, `Welcome to Eventyzze, your OTP is ${otpDetails.otp}, it expires soon`, "Eventyzze OTP");
        responseHandler.statusCode = 200;
        responseHandler.message =
            "OTP has been resent successfully, please check your mail";
        return responseHandler;
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
    await utilities_1.mailUtilities.sendMail(email, `Welcome to Eventyzze, your OTP is ${otp}, it expires in 5 minutes`, "Eventyzze OTP");
    responseHandler.statusCode = 200;
    responseHandler.message =
        "OTP has been resent successfully, please check your mail";
    return responseHandler;
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
    // adminRegistrationService,
    // userLogin,
    // verifyUserAccount,
    // resendVerificationLinkService
};
