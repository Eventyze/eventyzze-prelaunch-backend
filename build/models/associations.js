"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const walletModel_1 = __importDefault(require("./wallets/walletModel"));
const usersModel_1 = __importDefault(require("./users/usersModel"));
const otpModel_1 = __importDefault(require("./otp/otpModel"));
const followersModel_1 = __importDefault(require("./followers/followersModel"));
const followingsModel_1 = __importDefault(require("./followings/followingsModel"));
const eventsModel_1 = __importDefault(require("./events/eventsModel"));
usersModel_1.default.hasMany(otpModel_1.default, {
    foreignKey: 'userId',
    as: 'userOtp',
});
otpModel_1.default.belongsTo(usersModel_1.default, {
    foreignKey: 'userId',
    as: 'otpUser',
});
usersModel_1.default.hasOne(walletModel_1.default, {
    foreignKey: 'userId',
    as: 'wallet',
});
walletModel_1.default.belongsTo(usersModel_1.default, {
    foreignKey: 'userId',
    as: 'walletUser',
});
usersModel_1.default.hasOne(followersModel_1.default, {
    foreignKey: 'userId',
    as: 'userFollowers',
});
followersModel_1.default.belongsTo(usersModel_1.default, {
    foreignKey: 'userId',
    as: 'followerUser',
});
usersModel_1.default.hasOne(followingsModel_1.default, {
    foreignKey: "userId",
    as: "userFollowings",
});
followingsModel_1.default.belongsTo(usersModel_1.default, {
    foreignKey: "userId",
    as: "followingUser",
});
eventsModel_1.default.belongsTo(usersModel_1.default, {
    foreignKey: "userId",
    as: "events",
});
usersModel_1.default.hasMany(eventsModel_1.default, {
    foreignKey: "userId",
    as: "userEvents",
});
