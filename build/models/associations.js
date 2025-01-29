"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const usersModel_1 = __importDefault(require("./users/usersModel"));
const eventsModel_1 = __importDefault(require("./events/eventsModel"));
const walletModel_1 = __importDefault(require("./wallets/walletModel"));
const otpModel_1 = __importDefault(require("./otp/otpModel"));
const followersModel_1 = __importDefault(require("./followers/followersModel"));
const followingsModel_1 = __importDefault(require("./followings/followingsModel"));
const attendanceModel_1 = __importDefault(require("./attendance/attendanceModel"));
const paymentModel_1 = __importDefault(require("./payment/paymentModel"));
const likesModel_1 = __importDefault(require("./likes/likesModel"));
const dislikesModel_1 = __importDefault(require("./dislikes/dislikesModel"));
// **User ↔ Likes**
usersModel_1.default.hasMany(likesModel_1.default, { foreignKey: "userId", as: "userLikes" });
likesModel_1.default.belongsTo(usersModel_1.default, { foreignKey: "userId", as: "liker" });
// **User ↔ Dislikes**
usersModel_1.default.hasMany(dislikesModel_1.default, { foreignKey: "userId", as: "userDislikes" });
dislikesModel_1.default.belongsTo(usersModel_1.default, { foreignKey: "userId", as: "disliker" });
// **Events ↔ Likes**
eventsModel_1.default.hasMany(likesModel_1.default, { foreignKey: "eventId", as: "eventLikes" });
likesModel_1.default.belongsTo(eventsModel_1.default, { foreignKey: "eventId", as: "likedEvent" });
// **Events ↔ Dislikes**
eventsModel_1.default.hasMany(dislikesModel_1.default, { foreignKey: "eventId", as: "eventDislikes" });
dislikesModel_1.default.belongsTo(eventsModel_1.default, { foreignKey: "eventId", as: "dislikedEvent" });
// **User ↔ Payments**
usersModel_1.default.hasMany(paymentModel_1.default, { foreignKey: "userId", as: "payments" });
paymentModel_1.default.belongsTo(usersModel_1.default, { foreignKey: "userId", as: "payer" });
// **Events ↔ Payments**
eventsModel_1.default.hasMany(paymentModel_1.default, { foreignKey: "eventId", as: "eventPayments" });
paymentModel_1.default.belongsTo(eventsModel_1.default, { foreignKey: "eventId", as: "paidEvent" });
// **User ↔ Attendance**
usersModel_1.default.hasMany(attendanceModel_1.default, { foreignKey: "userId", as: "attendances" });
attendanceModel_1.default.belongsTo(usersModel_1.default, { foreignKey: "userId", as: "attendee" });
// **Events ↔ Attendance**
eventsModel_1.default.hasMany(attendanceModel_1.default, { foreignKey: "eventId", as: "eventAttendances" });
attendanceModel_1.default.belongsTo(eventsModel_1.default, { foreignKey: "eventId", as: "attendedEvent" });
// User ↔ OTP
usersModel_1.default.hasMany(otpModel_1.default, { foreignKey: "userId", as: "userOtp" });
otpModel_1.default.belongsTo(usersModel_1.default, { foreignKey: "userId", as: "otpUser" });
// User ↔ Wallet
usersModel_1.default.hasOne(walletModel_1.default, { foreignKey: "ownerId", as: "wallet" });
walletModel_1.default.belongsTo(usersModel_1.default, { foreignKey: "ownerId", as: "walletUser" });
// User ↔ Followers
usersModel_1.default.hasOne(followersModel_1.default, { foreignKey: "userId", as: "userFollowers" });
followersModel_1.default.belongsTo(usersModel_1.default, { foreignKey: "userId", as: "followerUser" });
// User ↔ Followings
usersModel_1.default.hasOne(followingsModel_1.default, { foreignKey: "userId", as: "userFollowings" });
followingsModel_1.default.belongsTo(usersModel_1.default, { foreignKey: "userId", as: "followingUser" });
// User ↔ Events
usersModel_1.default.hasMany(eventsModel_1.default, { foreignKey: "userId", as: "userEvents" });
eventsModel_1.default.belongsTo(usersModel_1.default, { foreignKey: "userId", as: "events" });
// Events ↔ Wallet
eventsModel_1.default.hasOne(walletModel_1.default, { foreignKey: "ownerId", as: "eventWallet" });
walletModel_1.default.belongsTo(eventsModel_1.default, { foreignKey: "ownerId", as: "walletEvent" });
