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
const userServiceResponses_1 = require("../../types/responseTypes/userServiceResponses");
const constants_1 = require("../../constants");
const response_utilities_1 = __importDefault(require("../../utilities/responseHandlers/response.utilities"));
const requestPasswordReset = utilities_1.errorUtilities.withErrorHandling(async (email) => {
    const user = await repositories_1.userRepositories.userRepositories.getOne({ email });
    if (!user) {
        throw utilities_1.errorUtilities.createError(userServiceResponses_1.UserResponses.NOT_FOUND, constants_1.StatusCodes.StatusCodes.NOT_FOUND);
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
    await utilities_1.mailUtilities.sendMail(email, constants_1.EmailConstants.generateMessages().PASSWORD_RESET_OTP(otp), constants_1.EmailConstants.MailSubjects.PASSWORD_RESET_REQUEST);
    return response_utilities_1.default.handleServicesResponse(constants_1.StatusCodes.StatusCodes.OK, userServiceResponses_1.UserResponses.PASSWORD_RESET_OTP);
});
const resetPassword = utilities_1.errorUtilities.withErrorHandling(async (resetPayload) => {
    const { email, otp, newPassword } = resetPayload;
    const user = await repositories_1.userRepositories.userRepositories.getOne({ email }, [constants_1.DatabaseConstants.DatabaseProjection.OTP, constants_1.DatabaseConstants.DatabaseProjection.ID]);
    if (!user) {
        throw utilities_1.errorUtilities.createError(userServiceResponses_1.UserResponses.NOT_FOUND, constants_1.StatusCodes.StatusCodes.NOT_FOUND);
    }
    const otpFinder = await repositories_1.otpRepositories.otpRpositories.getOne({
        id: user.otp.otpId,
        otp,
    });
    if (!otpFinder || otpFinder.used) {
        throw utilities_1.errorUtilities.createError(userServiceResponses_1.UserResponses.INVALID_OTP, constants_1.StatusCodes.StatusCodes.BAD_REQUEST);
    }
    const verify = await helpers_1.generalHelpers.verifyOtp(otpFinder);
    if (!verify) {
        throw utilities_1.errorUtilities.createError(userServiceResponses_1.UserResponses.EXPIRED_OTP, constants_1.StatusCodes.StatusCodes.BAD_REQUEST);
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
    await utilities_1.mailUtilities.sendMail(email, constants_1.EmailConstants.generateMessages().PASSWORD_RESET_SUCCESSFUL(), constants_1.EmailConstants.MailSubjects.SUCCESSFUL_PASSWORD_RESET);
    return response_utilities_1.default.handleServicesResponse(constants_1.StatusCodes.StatusCodes.OK, userServiceResponses_1.UserResponses.PASSWORD_RESET_SUCCESSFUL);
});
exports.default = {
    requestPasswordReset,
    resetPassword,
};
