"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("../../services");
const utilities_1 = require("../../utilities");
const services_2 = require("../../services");
const services_3 = require("../../services");
const services_4 = require("../../services");
const userRegisterWithEmail = async (request, response) => {
    console.log('body', request.body);
    const newUser = await services_1.userEmailAuthService.userRegisterWithEmailService(request.body);
    return utilities_1.responseUtilities.responseHandler(response, newUser.message, newUser.statusCode, newUser.data);
};
const userVerifiesOtp = async (request, response) => {
    const newUser = await services_1.userEmailAuthService.userVerifiesOtp(request.body);
    console.log('bod', request.body);
    return utilities_1.responseUtilities.responseHandler(response, newUser.message, newUser.statusCode, newUser.data);
};
const userLoginWithEmail = async (request, response) => {
    const loggedInUser = await services_1.userEmailAuthService.userLogin(request.body);
    if (loggedInUser.statusCode === 200) {
        response
            .header("x-access-token", loggedInUser.data.accessToken)
            .header("x-refresh-token", loggedInUser.data.refreshToken);
    }
    return utilities_1.responseUtilities.responseHandler(response, loggedInUser.message, loggedInUser.statusCode, loggedInUser.data);
};
const userResendsOtp = async (request, response) => {
    const resentOtp = await services_1.userEmailAuthService.userResendsOtpService(request.query);
    return utilities_1.responseUtilities.responseHandler(response, resentOtp.message, resentOtp.statusCode, resentOtp.data);
};
const googleAuth = async (request, response) => {
    const { token } = request.body;
    const authResponse = await services_2.googleAuthService.googleAuthService(token);
    if (authResponse.statusCode === 200 || authResponse.statusCode === 201) {
        response
            .header("x-access-token", authResponse.data.accessToken)
            .header("x-refresh-token", authResponse.data.refreshToken);
    }
    return utilities_1.responseUtilities.responseHandler(response, authResponse.message, authResponse.statusCode, authResponse.data);
};
const facebookAuth = async (request, response) => {
    const { accessToken } = request.body;
    const authResponse = await services_3.facebookAuthService.facebookAuthService(accessToken);
    if (authResponse.statusCode === 200 || authResponse.statusCode === 201) {
        response
            .header("x-access-token", authResponse.data.accessToken)
            .header("x-refresh-token", authResponse.data.refreshToken);
    }
    return utilities_1.responseUtilities.responseHandler(response, authResponse.message, authResponse.statusCode, authResponse.data);
};
const requestPasswordReset = async (request, response) => {
    const { email } = request.body;
    const resetResponse = await services_4.passwordResetService.requestPasswordReset(email);
    return utilities_1.responseUtilities.responseHandler(response, resetResponse.message, resetResponse.statusCode, resetResponse.data);
};
const resetPassword = async (request, response) => {
    const resetResponse = await services_4.passwordResetService.resetPassword(request.body);
    return utilities_1.responseUtilities.responseHandler(response, resetResponse.message, resetResponse.statusCode, resetResponse.data);
};
const userLogout = async (request, response) => {
    const loggedOutUser = await services_1.userEmailAuthService.userLogoutService(request.body);
    return utilities_1.responseUtilities.responseHandler(response, loggedOutUser.message, loggedOutUser.statusCode, loggedOutUser.data);
};
exports.default = {
    userRegisterWithEmail,
    userVerifiesOtp,
    userLoginWithEmail,
    userResendsOtp,
    googleAuth,
    facebookAuth,
    requestPasswordReset,
    resetPassword,
    userLogout
};
