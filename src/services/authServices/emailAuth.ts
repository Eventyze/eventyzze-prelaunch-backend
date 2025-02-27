import { ResponseDetails } from "../../types/generalTypes";
import validator from "validator";
import { generalHelpers } from "../../helpers";
import { mailUtilities, errorUtilities } from "../../utilities";
import { Roles, SignupProvider, UserAttributes } from "../../types/modelTypes";
import { v4 } from "uuid";
import otpDatabaseHelpers from "../../repositories/otpRepository/otpRepository.repositories";
import { Transaction } from "sequelize";
import performTransaction from "../../middlewares/databaseTransactions.middleware";
import {
  userRepositories,
  walletRepositories,
  followingsRepositories,
  folowersRepositories,
  otpRepositories,
} from "../../repositories";
import { EmailAuthResponses } from "../../types/responseTypes/emailAuthResponses";
// import { StatusCodes } from '../../constants/statusCodes.constants';
import { StatusCodes, EmailConstants, DatabaseConstants } from "../../constants";
import handleServicesResponse from "../../utilities/responseHandlers/response.utilities";

const userRegisterWithEmailService = errorUtilities.withErrorHandling(
  async (userPayload: Record<string, any>): Promise<Record<string, any>> => {

    let { email, password } = userPayload;

    email = email.trim();

    if (!validator.isEmail(email)) {
      throw errorUtilities.createError(EmailAuthResponses.INVALID_EMAIL, 400);
    }

    const existingUser = (await userRepositories.userRepositories.getOne({
      email,
    })) as unknown as UserAttributes;

    if (existingUser) {
      throw errorUtilities.createError(
        EmailAuthResponses.ALREADY_EXISTING_USER,
        StatusCodes.StatusCodes.CONFLICT
      );
    }

    const userId = v4();

    const { otp, expiresAt } = await generalHelpers.generateOtp();

    const otpId = v4();

    const otpPayload = {
      id: otpId,
      userId,
      otp,
      expiresAt,
      used: false,
    };

    const walletPayload = {
      id: v4(),
      ownerId: userId,
      walletType: Roles.User,
      totalBalance: 0,
    };

    const followersPayload = {
      id: v4(),
      userId,
      followers: [],
    };

    const followingsPayload = {
      id: v4(),
      userId,
      followings: [],
    };

    const userCreationPayload = {
      id: userId,
      email,
      password: await generalHelpers.hashPassword(password.trim()),
      eventyzzeId: "",
      provider: SignupProvider.Email,
      otp: {
        otp,
        otpId,
        expiresAt,
      },
      role: Roles.User,
    };

    const operations = [
      async (transaction: Transaction) => {
        await userRepositories.userRepositories.create(
          userCreationPayload,
          transaction
        );
      },

      async (transaction: Transaction) => {
        await walletRepositories.walletRepositories.create(
          walletPayload,
          transaction
        );
      },

      async (transaction: Transaction) => {
        await folowersRepositories.followersRepositories.create(
          followersPayload,
          transaction
        );
      },

      async (transaction: Transaction) => {
        await followingsRepositories.followingsRepositories.create(
          followingsPayload,
          transaction
        );
      },

      async (transaction: Transaction) => {
        await otpRepositories.otpRpositories.create(otpPayload, transaction);
      },
    ];

    await performTransaction.performTransaction(operations);

    const user: any = await userRepositories.userRepositories.getOne({
      id: userId,
    });

    await mailUtilities.sendMail(
      email,
      EmailConstants.generateAuthMailMessages().OTP(otp),
      EmailConstants.EmailAuthMailSubjects.OTP
    );

    return handleServicesResponse.handleServicesResponse(StatusCodes.StatusCodes.CREATED, EmailAuthResponses.SUCCESFUL_CREATION, user);
  }
);

const userVerifiesOtp = errorUtilities.withErrorHandling(
  async (userPayload: Record<string, any>): Promise<Record<string, any>> => {

    const { otp, email } = userPayload;

    const projection = [DatabaseConstants.DatabaseProjection.OTP, DatabaseConstants.DatabaseProjection.ID, DatabaseConstants.DatabaseProjection.ROLE, DatabaseConstants.DatabaseProjection.EMAIL];

    const user: any = await userRepositories.userRepositories.getOne(
      { email: email.trim() },
      projection
    );

    if (!user) {
      throw errorUtilities.createError(EmailAuthResponses.NOT_FOUND, StatusCodes.StatusCodes.NOT_FOUND);
    }

    const otpFinder: any = await otpRepositories.otpRpositories.getOne({
      id: user.otp.otpId,
      otp,
    });

    if (!otpFinder || otpFinder.used) {
      throw errorUtilities.createError(EmailAuthResponses.INVALID_OTP, StatusCodes.StatusCodes.BAD_REQUEST);
    }

    const verify = await generalHelpers.verifyOtp(otpFinder);

    if (!verify) {
      throw errorUtilities.createError(EmailAuthResponses.EXPIRED_OTP, StatusCodes.StatusCodes.BAD_REQUEST);
    }

    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = await generalHelpers.generateTokens(tokenPayload, "2h");
    const refreshToken = await generalHelpers.generateTokens(
      tokenPayload,
      "30d"
    );

    const operations = [
      async (transaction: Transaction) => {
        await otpRepositories.otpRpositories.updateOne(
          { id: otpFinder.id },
          { used: true },
          transaction
        );
      },

      async (transaction: Transaction) => {
        await userRepositories.userRepositories.updateOne(
          { email },
          { otp: null, isVerified: true },
          transaction
        );
      },
    ];

    await performTransaction.performTransaction(operations);

    const mainUser: any = await userRepositories.userRepositories.getOne({
      email,
    });

    await mailUtilities.sendMail(
      mainUser.email,
      EmailConstants.generateAuthMailMessages().ACCOUNT_VERIFIED(),
      EmailConstants.EmailAuthMailSubjects.ACCOUNT
    );

    return handleServicesResponse.handleServicesResponse(StatusCodes.StatusCodes.OK, EmailAuthResponses.VERIFIED_ACCOUNT, { user: mainUser, accessToken, refreshToken });
  }
);

const userLogin = errorUtilities.withErrorHandling(
  async (loginPayload: Record<string, any>) => {

    const { email, password, deviceId } = loginPayload;

    const projection = [
      DatabaseConstants.DatabaseProjection.PASSWORD,
      DatabaseConstants.DatabaseProjection.EMAIL,
      DatabaseConstants.DatabaseProjection.ID,
      DatabaseConstants.DatabaseProjection.ROLE,
      DatabaseConstants.DatabaseProjection.VERIFIED,
      DatabaseConstants.DatabaseProjection.BLACKLISTED,
      DatabaseConstants.DatabaseProjection.DEVICEID,
      DatabaseConstants.DatabaseProjection.REFRESH_TOKEN,
      DatabaseConstants.DatabaseProjection.INITIAL_SETUP_DONE,
      DatabaseConstants.DatabaseProjection.FULL_NAME,
      DatabaseConstants.DatabaseProjection.PROVIDER,
    ];

    const filter = { email: email.trim() };

    const existingUser: any = await userRepositories.userRepositories.getOne(
      filter,
      projection
    ) as unknown as UserAttributes;

    if (!existingUser) {
      throw errorUtilities.createError(EmailAuthResponses.NOT_FOUND, StatusCodes.StatusCodes.NOT_FOUND);
    }

    if (existingUser.provider !== SignupProvider.Email) {
      throw errorUtilities.createError(EmailAuthResponses.WRONG_LOGIN_METHOD, StatusCodes.StatusCodes.BAD_REQUEST);
    }

    if (!existingUser.isVerified) {
      return handleServicesResponse.handleServicesResponse(StatusCodes.StatusCodes.FORBIDDEN, EmailAuthResponses.UNVERIFIED_ACCOUNT, { user: existingUser });
    }

    if (existingUser.isBlacklisted) {
      throw errorUtilities.createError(EmailAuthResponses.BLOCKED_ACCOUNT, StatusCodes.StatusCodes.BAD_REQUEST);
    }

    const verifyPassword = await generalHelpers.validatePassword(
      password.trim(),
      existingUser.password
    );

    if (!verifyPassword) {
      throw errorUtilities.createError(
        EmailAuthResponses.INCORRECT_PASSWORD,
        StatusCodes.StatusCodes.BAD_REQUEST
      );
    }

    if (existingUser.activeDeviceId && existingUser.activeDeviceId !== deviceId) {
      throw errorUtilities.createError(
        EmailAuthResponses.ALREADY_LOGGED_IN,
        StatusCodes.StatusCodes.CONFLICT
      );
    }

    const tokenPayload = {
      id: existingUser.id,
      email: existingUser.email,
      role: existingUser.role,
    };

    const accessToken = await generalHelpers.generateTokens(tokenPayload, "2h");
    const refreshToken = await generalHelpers.generateTokens(
      tokenPayload,
      "30d"
    );

    let mailMessage = "";
    let mailSubject = "";

    const dateDetails = generalHelpers.dateFormatter(new Date());

    if (!existingUser.refreshToken || !existingUser.isInitialProfileSetupDone) {
      mailMessage = `${EmailConstants.EmailAuthMailSubjects.WELCOME} ${
        existingUser.fullName ? existingUser.fullName : ""
      }! ${EmailConstants.generateAuthMailMessages().NEW_USER_LOGIN()}`;

      mailSubject = `${EmailConstants.EmailAuthMailSubjects.WELCOME} ${
        existingUser.fullName ? existingUser.fullName : ""
      }`;
    } else {
      mailSubject = EmailConstants.EmailAuthMailSubjects.LOGIN_ACTIVITY;
      mailMessage = EmailConstants.generateAuthMailMessages().EXISTING_USER_LOGIN(existingUser.fullName, dateDetails.date, dateDetails.time);
    }

    existingUser.refreshToken = refreshToken;

    existingUser.activeDeviceId = deviceId;

    await userRepositories.userRepositories.updateOne({email}, {refreshToken:refreshToken, activeDeviceId:deviceId})

    const newExistingUser:any =
      await userRepositories.userRepositories.getOne(filter);

    
    const userWithoutPassword = await userRepositories.userRepositories.extractUserDetails(newExistingUser)

    await mailUtilities.sendMail(existingUser.email, mailMessage, mailSubject);

    return handleServicesResponse.handleServicesResponse(StatusCodes.StatusCodes.OK, EmailAuthResponses.WELCOME_BACK, { user: userWithoutPassword, accessToken, refreshToken });
  }
);

const userResendsOtpService = errorUtilities.withErrorHandling(
  async (resendPayload: Record<string, any>) => {

    const { email } = resendPayload;

    const user: any = await userRepositories.userRepositories.getOne(
      { email },
      [DatabaseConstants.DatabaseProjection.EMAIL, DatabaseConstants.DatabaseProjection.ID, DatabaseConstants.DatabaseProjection.OTP, DatabaseConstants.DatabaseProjection.VERIFIED]
    );

    if (!user) {
      return handleServicesResponse.handleServicesResponse(StatusCodes.StatusCodes.NOT_FOUND, EmailAuthResponses.NOT_FOUND);
    }

    if (user.isVerified) {
      return handleServicesResponse.handleServicesResponse(StatusCodes.StatusCodes.BAD_REQUEST, EmailAuthResponses.ALREADY_VERIFIED);
    }

    const otpDetails = user.otp;

    if (new Date(otpDetails.expiresAt) > new Date()) {
      await mailUtilities.sendMail(
        email,
        EmailConstants.generateAuthMailMessages().OTP(otpDetails.otp),
        EmailConstants.EmailAuthMailSubjects.OTP
      );

      return handleServicesResponse.handleServicesResponse(StatusCodes.StatusCodes.OK, EmailAuthResponses.OTP_RESENT);
    }

    const { otp, expiresAt } = await generalHelpers.generateOtp();

    const otpId = v4();

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
      async (transaction: Transaction) => {
        await otpRepositories.otpRpositories.create(otpPayload, transaction);
      },

      async (transaction: Transaction) => {
        await userRepositories.userRepositories.updateOne(
          { id: user.id },
          userUpdatePayload,
          transaction
        );
      },
    ];

    await performTransaction.performTransaction(operations);

    await mailUtilities.sendMail(
      email,
      EmailConstants.generateAuthMailMessages().OTP(otp),
      EmailConstants.EmailAuthMailSubjects.OTP
    );

    return handleServicesResponse.handleServicesResponse(StatusCodes.StatusCodes.OK, EmailAuthResponses.OTP_RESENT);
  }
);

const userLogoutService = errorUtilities.withErrorHandling(
  async (logoutPayload: Record<string, any>) => {

    const { email } = logoutPayload;
    const user = await userRepositories.userRepositories.getOne({ email }) as unknown as UserAttributes;
  
    if (user) {
      await userRepositories.userRepositories.updateOne({email}, {activeDeviceId:null})
    }

    return handleServicesResponse.handleServicesResponse(StatusCodes.StatusCodes.OK, EmailAuthResponses.LOGOUT_MESSAGE);
})

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

export default {
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
