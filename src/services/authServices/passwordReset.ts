import { ResponseDetails } from "../../types/generalTypes";
import { errorUtilities, mailUtilities } from "../../utilities";
import { generalHelpers } from "../../helpers";
import { v4 } from "uuid";
import { userRepositories, otpRepositories } from "../../repositories";
import performTransaction from "../../middlewares/databaseTransactions.middleware";
import { Transaction } from "sequelize";

const requestPasswordReset = errorUtilities.withErrorHandling(
  async (email: string): Promise<Record<string, any>> => {
    const responseHandler: ResponseDetails = {
      statusCode: 0,
      message: "",
      data: {},
      details: {},
      info: {},
    };

    const user:any = await userRepositories.userRepositories.getOne({ email });

    if (!user) {
      throw errorUtilities.createError("User not found", 404);
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
      `Your password reset OTP is ${otp}. It expires in 5 minutes.`,
      "Password Reset Request"
    );

    responseHandler.statusCode = 200;
    responseHandler.message = "Password reset OTP has been sent to your email";
    return responseHandler;
  }
);

const resetPassword = errorUtilities.withErrorHandling(
  async (resetPayload: Record<string, any>): Promise<Record<string, any>> => {
    const responseHandler: ResponseDetails = {
      statusCode: 0,
      message: "",
      data: {},
      details: {},
      info: {},
    };

    const { email, otp, newPassword } = resetPayload;

    const user: any = await userRepositories.userRepositories.getOne(
      { email },
      ["otp", "id"]
    );

    if (!user) {
      throw errorUtilities.createError("User not found", 404);
    }

    const otpFinder: any = await otpRepositories.otpRpositories.getOne({
      id: user.otp.otpId,
      otp,
    });

    if (!otpFinder || otpFinder.used) {
      throw errorUtilities.createError(
        "Invalid OTP. Please try again or request a new OTP",
        400
      );
    }

    const verify = await generalHelpers.verifyOtp(otpFinder);

    if (!verify) {
      throw errorUtilities.createError("OTP expired. Please request a new OTP", 400);
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
      "Your password has been reset successfully.",
      "Password Reset Successful"
    );

    responseHandler.statusCode = 200;
    responseHandler.message = "Password reset successful";
    return responseHandler;
  }
);

export default {
  requestPasswordReset,
  resetPassword,
}; 