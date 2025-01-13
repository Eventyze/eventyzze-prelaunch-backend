"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = require("../../utilities");
const helpers_1 = require("../../helpers");
const uuid_1 = require("uuid");
const repositories_1 = require("../../repositories");
const databaseTransactions_middleware_1 = __importDefault(require("../../middlewares/databaseTransactions.middleware"));
const requestPasswordReset = utilities_1.errorUtilities.withErrorHandling(async (email) => {
    const responseHandler = {
        statusCode: 0,
        message: "",
        data: {},
        details: {},
        info: {},
    };
    const user = await repositories_1.userRepositories.userRepositories.getOne({ email });
    if (!user) {
        throw utilities_1.errorUtilities.createError("User not found", 404);
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
    await utilities_1.mailUtilities.sendMail(email, `Your password reset OTP is ${otp}. It expires in 5 minutes.`, "Password Reset Request");
    responseHandler.statusCode = 200;
    responseHandler.message = "Password reset OTP has been sent to your email";
    return responseHandler;
});
const resetPassword = utilities_1.errorUtilities.withErrorHandling(async (resetPayload) => {
    const responseHandler = {
        statusCode: 0,
        message: "",
        data: {},
        details: {},
        info: {},
    };
    const { email, otp, newPassword } = resetPayload;
    const user = await repositories_1.userRepositories.userRepositories.getOne({ email }, ["otp", "id"]);
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
    const hashedPassword = await helpers_1.generalHelpers.hashPassword(newPassword);
    const operations = [
        async (transaction) => {
            await repositories_1.otpRepositories.otpRpositories.updateOne({ id: otpFinder.id }, { used: true }, transaction);
        },
        async (transaction) => {
            await repositories_1.userRepositories.userRepositories.updateOne({ email }, { password: hashedPassword, otp: null }, transaction);
        },
    ];
    await databaseTransactions_middleware_1.default.performTransaction(operations);
    await utilities_1.mailUtilities.sendMail(email, "Your password has been reset successfully.", "Password Reset Successful");
    responseHandler.statusCode = 200;
    responseHandler.message = "Password reset successful";
    return responseHandler;
});
exports.default = {
    requestPasswordReset,
    resetPassword,
};
