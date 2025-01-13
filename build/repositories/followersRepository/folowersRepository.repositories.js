"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const followersModel_1 = __importDefault(require("../../models/followers/followersModel"));
const followersRepositories = {
    create: async (data, transaction) => {
        try {
            const newOtp = await followersModel_1.default.create(data, { transaction });
            return newOtp;
        }
        catch (error) {
            throw new Error(`Error creating user followers: ${error.message}`);
        }
    },
};
exports.default = {
    followersRepositories,
};
