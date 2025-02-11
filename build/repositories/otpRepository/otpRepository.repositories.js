"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const otpModel_1 = __importDefault(require("../../models/otp/otpModel"));
const otpRpositories = {
    create: async (data, transaction) => {
        try {
            const newOtp = await otpModel_1.default.create(data, { transaction });
            return newOtp;
        }
        catch (error) {
            throw new Error(`Error creating User: ${error.message}`);
        }
    },
    getOne: async (filter, projection) => {
        try {
            const user = await otpModel_1.default.findOne({
                where: filter,
                attributes: projection,
            });
            return user;
        }
        catch (error) {
            throw new Error(`Error fetching User: ${error.message}`);
        }
    },
    updateOne: async (filter, update, transaction) => {
        try {
            const otp = await otpModel_1.default.findOne({ where: filter });
            await otp.update(update, { transaction });
            return otp;
        }
        catch (error) {
            throw new Error(`Error updating User: ${error.message}`);
        }
    },
};
exports.default = {
    otpRpositories,
};
