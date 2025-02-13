"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailAuthResponses = void 0;
var EmailAuthResponses;
(function (EmailAuthResponses) {
    EmailAuthResponses["INVALID_EMAIL"] = "Invalid email";
    EmailAuthResponses["ALREADY_EXISTING_USER"] = "User already exists with this email";
    EmailAuthResponses["SUCCESFUL_CREATION"] = "User created successfully, an OTP has been sent to your mail for email verification";
    EmailAuthResponses["NOT_FOUND"] = "User not found or email does not exist. Please register";
    EmailAuthResponses["WRONG_LOGIN_METHOD"] = "It looks like you signed up with Google or Facebook. Please use that login method.";
    EmailAuthResponses["INVALID_OTP"] = "Invalid OTP. Please try again or request a new OTP";
    EmailAuthResponses["EXPIRED_OTP"] = "OTP expired. Please request a new OTP";
    EmailAuthResponses["VERIFIED_ACCOUNT"] = "Account verified successfully";
    EmailAuthResponses["UNVERIFIED_ACCOUNT"] = "Email is not verified. Please request a new OTP to verify your account";
    EmailAuthResponses["INCORRECT_PASSWORD"] = "Incorrect Password";
    EmailAuthResponses["WELCOME_BACK"] = "Welcome Back";
    EmailAuthResponses["ALREADY_VERIFIED"] = "Account already verified, please login";
    EmailAuthResponses["OTP_RESENT"] = "OTP has been resent successfully, please check your mail";
    EmailAuthResponses["BLOCKED_ACCOUNT"] = "Account Blocked, contact admin on eventyzze@gmail.com";
    EmailAuthResponses["ALREADY_LOGGED_IN"] = "Already logged in on another device";
    EmailAuthResponses["LOGOUT_MESSAGE"] = "Sad to see you go, but we believe you will be back soon";
})(EmailAuthResponses || (exports.EmailAuthResponses = EmailAuthResponses = {}));
