"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const walletModel_1 = __importDefault(require("../../models/wallets/walletModel"));
const walletRepositories = {
    create: async (data, transaction) => {
        try {
            const newOtp = await walletModel_1.default.create(data, { transaction });
            return newOtp;
        }
        catch (error) {
            throw new Error(`Error creating user wallet: ${error.message}`);
        }
    },
};
exports.default = {
    walletRepositories,
};
