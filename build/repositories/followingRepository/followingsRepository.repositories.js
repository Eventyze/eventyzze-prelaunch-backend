"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const followingsModel_1 = __importDefault(require("../../models/followings/followingsModel"));
const followingsRepositories = {
    create: async (data, transaction) => {
        try {
            const newOtp = await followingsModel_1.default.create(data, { transaction });
            return newOtp;
        }
        catch (error) {
            throw new Error(`Error creating user followings: ${error.message}`);
        }
    },
};
exports.default = {
    followingsRepositories,
};
