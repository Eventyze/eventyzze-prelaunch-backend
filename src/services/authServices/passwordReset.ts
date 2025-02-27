import { ResponseDetails } from "../../types/generalTypes";
import { errorUtilities, mailUtilities } from "../../utilities";
import { generalHelpers } from "../../helpers";
import { v4 } from "uuid";
import { userRepositories, otpRepositories } from "../../repositories";
import performTransaction from "../../middlewares/databaseTransactions.middleware";
import { Transaction } from "sequelize";
import { UserResponses } from "../../types/responseTypes/userServiceResponses";
import { DatabaseConstants, EmailConstants, StatusCodes } from "../../constants";
import handleServicesResponse from "../../utilities/responseHandlers/response.utilities";


const requestPasswordReset = errorUtilities.withErrorHandling(
  async (email: string): Promise<Record<string, any>> => {

    const user:any = await userRepositories.userRepositories.getOne({ email });

    if (!user) {
      throw errorUtilities.createError(UserResponses.NOT_FOUND, StatusCodes.StatusCodes.NOT_FOUND);
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
      EmailConstants.generateMessages().PASSWORD_RESET_OTP(otp),
      EmailConstants.MailSubjects.PASSWORD_RESET_REQUEST
    );

    return handleServicesResponse.handleServicesResponse(StatusCodes.StatusCodes.OK, UserResponses.PASSWORD_RESET_OTP)
  }
);

const resetPassword = errorUtilities.withErrorHandling(
  async (resetPayload: Record<string, any>): Promise<Record<string, any>> => {

    const { email, otp, newPassword } = resetPayload;

    const user: any = await userRepositories.userRepositories.getOne(
      { email },
      [DatabaseConstants.DatabaseProjection.OTP, DatabaseConstants.DatabaseProjection.ID]
    );

    if (!user) {
      throw errorUtilities.createError(UserResponses.NOT_FOUND, StatusCodes.StatusCodes.NOT_FOUND);
    }

    const otpFinder: any = await otpRepositories.otpRpositories.getOne({
      id: user.otp.otpId,
      otp,
    });

    if (!otpFinder || otpFinder.used) {
      throw errorUtilities.createError(
        UserResponses.INVALID_OTP,
        StatusCodes.StatusCodes.BAD_REQUEST
      );
    }

    const verify = await generalHelpers.verifyOtp(otpFinder);

    if (!verify) {
      throw errorUtilities.createError(UserResponses.EXPIRED_OTP, StatusCodes.StatusCodes.BAD_REQUEST);
    }

    const hashedPassword = await generalHelpers.hashPassword(newPassword);

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
          { password: hashedPassword, otp: null },
          transaction
        );
      },
    ];

    await performTransaction.performTransaction(operations);

    await mailUtilities.sendMail(
      email,
      EmailConstants.generateMessages().PASSWORD_RESET_SUCCESSFUL(),
      EmailConstants.MailSubjects.SUCCESSFUL_PASSWORD_RESET
    );

    return handleServicesResponse.handleServicesResponse(StatusCodes.StatusCodes.OK, UserResponses.PASSWORD_RESET_SUCCESSFUL)
  }
);


export default {
  requestPasswordReset,
  resetPassword,
}; 