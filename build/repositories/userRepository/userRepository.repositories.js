"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const usersModel_1 = __importDefault(require("../../models/users/usersModel"));
const walletModel_1 = __importDefault(require("../../models/wallets/walletModel"));
const followingsModel_1 = __importDefault(require("../../models/followings/followingsModel"));
const followersModel_1 = __importDefault(require("../../models/followers/followersModel"));
const userRepositories = {
    create: async (data, transaction) => {
        try {
            const newUser = await usersModel_1.default.create(data, { transaction });
            return newUser;
        }
        catch (error) {
            throw new Error(`Error creating User: ${error.message}`);
        }
    },
    updateOne: async (filter, update, transaction) => {
        try {
            const user = await usersModel_1.default.findOne({ where: filter });
            await user.update(update, { transaction });
            return user;
        }
        catch (error) {
            throw new Error(`Error updating User: ${error.message}`);
        }
    },
    updateMany: async (filter, update) => {
        try {
            const [affectedRows] = await usersModel_1.default.update(update, { where: filter });
            return { affectedRows };
        }
        catch (error) {
            throw new Error(`Error updating Users: ${error.message}`);
        }
    },
    deleteOne: async (filter) => {
        try {
            const user = await usersModel_1.default.findOne({ where: filter });
            if (!user)
                throw new Error("User not found");
            await user.destroy();
            return user;
        }
        catch (error) {
            throw new Error(`Error deleting User: ${error.message}`);
        }
    },
    deleteMany: async (filter) => {
        try {
            const affectedRows = await usersModel_1.default.destroy({ where: filter });
            return { affectedRows };
        }
        catch (error) {
            throw new Error(`Error deleting Users: ${error.message}`);
        }
    },
    getOne: async (filter, projection = null, include = false) => {
        try {
            const user = await usersModel_1.default.findOne({
                where: filter,
                attributes: projection,
                include: include ? [
                    { model: walletModel_1.default, as: 'wallet' },
                    { model: followersModel_1.default, as: 'userFollowers' },
                    { model: followingsModel_1.default, as: 'userFollowings' }
                ] : []
            });
            return user;
        }
        catch (error) {
            throw new Error(`Error fetching User: ${error.message}`);
        }
    },
    getMany: async (filter, projection, options, order) => {
        try {
            const users = await usersModel_1.default.findAll({
                where: filter,
                attributes: projection,
                ...options,
                order
            });
            return users;
        }
        catch (error) {
            throw new Error(`Error fetching Users: ${error.message}`);
        }
    },
    extractUserDetails: async (userData) => {
        try {
            return {
                email: userData.email,
                fullName: userData.fullName,
                userName: userData.userName,
                role: userData.role,
                phone: userData.phone,
                isVerified: userData.isVerified,
                refreshToken: userData.refreshToken,
                isInitialProfileSetupDone: userData.isInitialProfileSetupDone,
                numberOfEventsHosted: userData.numberOfEventsHosted,
                numberOfEventsAttended: userData.numberOfEventsAttended,
                bio: userData.bio,
                userImage: userData.userImage,
                country: userData.country,
                isBlacklisted: userData.isBlacklisted,
                subscriptionPlan: userData.subscriptionPlan,
                accountStatus: userData.accountStatus,
                interests: userData.interests,
                noOfFollowers: userData.noOfFollowers,
                noOfFollowings: userData.noOfFollowings,
                id: userData.id,
                isInitialHostingOfferExhausted: userData.isInitialHostingOfferExhausted,
                eventyzzeId: userData.eventyzzeId,
                subscriptionDetails: userData.subscriptionDetails,
                subScriptionId: userData.subScriptionId,
                state: userData.state,
                address: userData.address,
            };
        }
        catch (error) {
            throw new Error(`Error fetching Users: ${error.message}`);
        }
    },
};
exports.default = {
    userRepositories,
};
