"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const transactionsModel_1 = require("../../models/transactions/transactionsModel");
const transactionRepositories = {
    create: async (data, transaction) => {
        try {
            const newTransaction = await transactionsModel_1.Transactions.create(data, { transaction });
            return newTransaction;
        }
        catch (error) {
            throw new Error(`Error creating Transaction: ${error.message}`);
        }
    },
    getOne: async (filter, projection = null, include = false) => {
        try {
            const transaction = await transactionsModel_1.Transactions.findOne({
                where: filter,
                attributes: projection,
                // include: include ? [
                //   { model: Wallet, as: 'wallet' },
                // ] : []
            });
            return transaction;
        }
        catch (error) {
            throw new Error(`Error fetching Transaction: ${error.message}`);
        }
    },
};
exports.default = {
    transactionRepositories,
};
