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
import { EmailAuthResponses } from "../../types/responseTypes/responses";

const userRegisterWithEmailService = errorUtilities.withErrorHandling(
  async (userPayload: Record<string, any>): Promise<Record<string, any>> => {
    const responseHandler: ResponseDetails = {
      statusCode: 0,
      message: "",
      data: {},
      details: {},
      info: {},
    };

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
        409
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
      `Welcome to Eventyzze, your OTP is ${otp}, it expires in 5 minutes`,
      "Eventyzze OTP"
    );

    responseHandler.statusCode = 201;
    responseHandler.message = EmailAuthResponses.SUCCESFUL_CREATION;
    responseHandler.data = user;
    return responseHandler;
  }
);

const userVerifiesOtp = errorUtilities.withErrorHandling(
  async (userPayload: Record<string, any>): Promise<Record<string, any>> => {
    const responseHandler: ResponseDetails = {
      statusCode: 0,
      message: "",
      data: {},
      details: {},
      info: {},
    };

    const { otp, email } = userPayload;

    const projection = ["otp", "id", "role", "email"];

    const user: any = await userRepositories.userRepositories.getOne(
      { email: email.trim() },
      projection
    );

    if (!user) {
      throw errorUtilities.createError(EmailAuthResponses.NOT_FOUND, 404);
    }

    const otpFinder: any = await otpRepositories.otpRpositories.getOne({
      id: user.otp.otpId,
      otp,
    });

    if (!otpFinder || otpFinder.used) {
      throw errorUtilities.createError(EmailAuthResponses.INVALID_OTP, 400);
    }

    const verify = await generalHelpers.verifyOtp(otpFinder);

    if (!verify) {
      throw errorUtilities.createError(EmailAuthResponses.EXPIRED_OTP, 400);
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
      `Welcome to Eventyzze, your email has been verified successfully. You can now login and start hosting your events 😊`,
      "Email Verified"
    );

    responseHandler.statusCode = 200;
    responseHandler.message = EmailAuthResponses.VERIFIED_ACCOUNT;
    responseHandler.data = { user: mainUser, accessToken, refreshToken };
    return responseHandler;
  }
);

const userLogin = errorUtilities.withErrorHandling(
  async (loginPayload: Record<string, any>) => {
    const responseHandler: ResponseDetails = {
      statusCode: 0,
      message: "",
      data: {},
      details: {},
      info: {},
    };

    const { email, password, deviceId } = loginPayload;

    const projection = [
      "password",
      "email",
      "id",
      "role",
      "isVerified",
      "isBlacklisted",
      "activeDeviceId",
      "refreshToken",
      "isInitialProfileSetupDone",
      "fullName",
      "provider",
    ];

    const filter = { email: email.trim() };

    const existingUser: any = await userRepositories.userRepositories.getOne(
      filter,
      projection
    ) as unknown as UserAttributes;

    if (!existingUser) {
      throw errorUtilities.createError(EmailAuthResponses.NOT_FOUND, 404);
    }

    if (existingUser.provider !== SignupProvider.Email) {
      throw errorUtilities.createError(EmailAuthResponses.WRONG_LOGIN_METHOD, 400)
    }

    if (!existingUser.isVerified) {
      responseHandler.statusCode = 403;
      responseHandler.message = EmailAuthResponses.UNVERIFIED_ACCOUNT;
      responseHandler.data = { user: existingUser };
      return responseHandler;
    }

    if (existingUser.isBlacklisted) {
      throw errorUtilities.createError(EmailAuthResponses.BLOCKED_ACCOUNT, 400);
    }

    const verifyPassword = await generalHelpers.validatePassword(
      password.trim(),
      existingUser.password
    );

    if (!verifyPassword) {
      throw errorUtilities.createError(
        EmailAuthResponses.INCORRECT_PASSWORD,
        400
      );
    }

    if (existingUser.activeDeviceId && existingUser.activeDeviceId !== deviceId) {
      throw errorUtilities.createError(
        EmailAuthResponses.ALREADY_LOGGED_IN,
        409
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
      mailMessage = `Welcome to Eventyzze ${
        existingUser.fullName ? existingUser.fullName : ""
      }! <br /><br />

          We're excited to have you on board. Eventyzze is your go-to platform for discovering, organizing, and sharing amazing events. Whether you're attending or hosting, we're here to make your experience seamless and enjoyable. <br /> <br />

          If you have any questions or need help getting started, feel free to reach out to our support team. We're always here to assist you. <br /> <br />

          Let's make some unforgettable moments together!`;

      mailSubject = `Welcome to Eventyzze ${
        existingUser.fullName ? existingUser.fullName : ""
      }`;
    } else {
      mailSubject = "Activity Detected on Your Account";
      mailMessage = `Hi ${existingUser.fullName ? existingUser.fullName : ""},
      There was a login to your account on ${dateDetails.date} by ${
        dateDetails.time
      }.<br /><br /> If you did not initiate this login, contact our support team to restrict your account. If it was you, please ignore.`;
    }

    existingUser.refreshToken = refreshToken;

    existingUser.activeDeviceId = deviceId;

    await userRepositories.userRepositories.updateOne({email}, {refreshToken:refreshToken, activeDeviceId:deviceId})

    const newExistingUser:any =
      await userRepositories.userRepositories.getOne(filter);

    
    const userWithoutPassword = await userRepositories.userRepositories.extractUserDetails(newExistingUser)

    await mailUtilities.sendMail(existingUser.email, mailMessage, mailSubject);

    responseHandler.statusCode = 200;

    responseHandler.message =
      EmailAuthResponses.WELCOME_BACK +
      `${existingUser.userName ? existingUser.userName : ""}`;

    responseHandler.data = {
      user: userWithoutPassword,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };

    return responseHandler;
  }
);

const userResendsOtpService = errorUtilities.withErrorHandling(
  async (resendPayload: Record<string, any>) => {
    const responseHandler: ResponseDetails = {
      statusCode: 0,
      message: "",
      data: {},
      details: {},
      info: {},
    };

    const { email } = resendPayload;

    const user: any = await userRepositories.userRepositories.getOne(
      { email },
      ["email", "id", "otp", "isVerified"]
    );

    if (!user) {
      responseHandler.statusCode = 404;
      responseHandler.message = EmailAuthResponses.NOT_FOUND;
      return responseHandler;
    }

    if (user.isVerified) {
      responseHandler.statusCode = 400;
      responseHandler.message = EmailAuthResponses.ALREADY_VERIFIED;
      return responseHandler;
    }

    const otpDetails = user.otp;

    if (new Date(otpDetails.expiresAt) > new Date()) {
      await mailUtilities.sendMail(
        email,
        `Welcome to Eventyzze, your OTP is ${otpDetails.otp}, it expires soon`,
        "Eventyzze OTP"
      );

      responseHandler.statusCode = 200;
      responseHandler.message = EmailAuthResponses.OTP_RESENT;
      return responseHandler;
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
      `Welcome to Eventyzze, your OTP is ${otp}, it expires in 5 minutes`,
      "Eventyzze OTP"
    );

    responseHandler.statusCode = 200;
    responseHandler.message = EmailAuthResponses.OTP_RESENT;
    return responseHandler;
  }
);

const userLogoutService = errorUtilities.withErrorHandling(
  async (logoutPayload: Record<string, any>) => {
    const responseHandler: ResponseDetails = {
      statusCode: 0,
      message: "",
      data: {},
      details: {},
      info: {},
    };

    const { email } = logoutPayload;
    const user = await userRepositories.userRepositories.getOne({ email }) as unknown as UserAttributes;
  
    if (user) {
      await userRepositories.userRepositories.updateOne({email}, {activeDeviceId:null})
    }

    responseHandler.message = EmailAuthResponses.LOGOUT_MESSAGE;
    responseHandler.statusCode = 200;
    return responseHandler;

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
