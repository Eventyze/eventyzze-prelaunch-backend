
enum DatabaseProjection {
    OTP = "otp", 
    ID = "id", 
    ROLE = "role", 
    EMAIL = "email",
    PASSWORD = "password",
    VERIFIED = "isVerified",
    BLACKLISTED = "isBlacklisted",
    DEVICEID = "activeDeviceId",
    REFRESH_TOKEN = "refreshToken",
    INITIAL_SETUP_DONE = "isInitialProfileSetupDone",
    FULL_NAME = "fullName",
    PROVIDER = "provider",
    USERNAME = "userName",
    HOSTED_EVENTS = "numberOfEventsHosted",
    ATTENDED_EVENTS = "numberOfEventsAttended",
    USERIMAGE = "userImage",
    NO_OF_FOLLOWERS = "noOfFollowers",
    NEWLY_UPGRADED = "newlyUpgraded",
    PHONE_NUMBER = "phone",
    EVENTYZZE_ID = "eventyzzeId",
    CREATED_AT = "createdAt",
    SUBSCRIPTION_PLAN = "subscriptionPlan",
    SUBSCRIPTION_DETAILS = "subscriptionDetails",
    EVENT_TITLE = "eventTitle",
    EVENT_OWNER_NAME = "ownerName",
    EVENT_COVER_IMAGE = "coverImage",
    EVENT_IS_LIVE = "isLive",
    EVENT_NO_OF_LIKES = "noOfLikes",
    INTERESTS = "interests",

}

enum DatabaseCadre {
    DESC = "DESC",
}


export default {
DatabaseProjection,
DatabaseCadre

};