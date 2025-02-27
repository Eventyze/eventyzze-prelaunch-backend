"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DatabaseProjection;
(function (DatabaseProjection) {
    DatabaseProjection["OTP"] = "otp";
    DatabaseProjection["ID"] = "id";
    DatabaseProjection["ROLE"] = "role";
    DatabaseProjection["EMAIL"] = "email";
    DatabaseProjection["PASSWORD"] = "password";
    DatabaseProjection["VERIFIED"] = "isVerified";
    DatabaseProjection["BLACKLISTED"] = "isBlacklisted";
    DatabaseProjection["DEVICEID"] = "activeDeviceId";
    DatabaseProjection["REFRESH_TOKEN"] = "refreshToken";
    DatabaseProjection["INITIAL_SETUP_DONE"] = "isInitialProfileSetupDone";
    DatabaseProjection["FULL_NAME"] = "fullName";
    DatabaseProjection["PROVIDER"] = "provider";
})(DatabaseProjection || (DatabaseProjection = {}));
exports.default = {
    DatabaseProjection,
};
