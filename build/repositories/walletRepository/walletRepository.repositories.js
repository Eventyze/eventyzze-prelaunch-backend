"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const walletModel_1 = __importDefault(require("../../models/wallets/walletModel"));
const walletRepositories = {
    create: async (data, transaction) => {
        try {
            const newWallet = await walletModel_1.default.create(data, { transaction });
            return newWallet;
        }
        catch (error) {
            throw new Error(`Error creating user wallet: ${error.message}`);
        }
    },
    getOne: async (filter, projection = null, include = false) => {
        try {
            const wallet = await walletModel_1.default.findOne({
                where: filter,
                attributes: projection,
                // include: include ? [
                //   { model: Wallet, as: 'wallet' },
                // ] : []
            });
            return wallet;
        }
        catch (error) {
            throw new Error(`Error fetching Wallet: ${error.message}`);
        }
    },
    updateOne: async (filter, update, transaction) => {
        try {
            const wallet = await walletModel_1.default.findOne({ where: filter });
            await wallet.update(update, { transaction });
            return wallet;
        }
        catch (error) {
            throw new Error(`Error updating wallet: ${error.message}`);
        }
    },
};
exports.default = {
    walletRepositories,
};
