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
    DatabaseProjection["USERNAME"] = "userName";
    DatabaseProjection["HOSTED_EVENTS"] = "numberOfEventsHosted";
    DatabaseProjection["ATTENDED_EVENTS"] = "numberOfEventsAttended";
    DatabaseProjection["USERIMAGE"] = "userImage";
    DatabaseProjection["NO_OF_FOLLOWERS"] = "noOfFollowers";
    DatabaseProjection["NEWLY_UPGRADED"] = "newlyUpgraded";
    DatabaseProjection["PHONE_NUMBER"] = "phone";
    DatabaseProjection["EVENTYZZE_ID"] = "eventyzzeId";
    DatabaseProjection["CREATED_AT"] = "createdAt";
    DatabaseProjection["SUBSCRIPTION_PLAN"] = "subscriptionPlan";
    DatabaseProjection["SUBSCRIPTION_DETAILS"] = "subscriptionDetails";
    DatabaseProjection["EVENT_TITLE"] = "eventTitle";
    DatabaseProjection["EVENT_OWNER_NAME"] = "ownerName";
    DatabaseProjection["EVENT_COVER_IMAGE"] = "coverImage";
    DatabaseProjection["EVENT_IS_LIVE"] = "isLive";
    DatabaseProjection["EVENT_NO_OF_LIKES"] = "noOfLikes";
    DatabaseProjection["INTERESTS"] = "interests";
})(DatabaseProjection || (DatabaseProjection = {}));
var DatabaseCadre;
(function (DatabaseCadre) {
    DatabaseCadre["DESC"] = "DESC";
})(DatabaseCadre || (DatabaseCadre = {}));
exports.default = {
    DatabaseProjection,
    DatabaseCadre
};
