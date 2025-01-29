"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const attendanceModel_1 = __importDefault(require("../../models/attendance/attendanceModel"));
const attendanceRepositories = {
    create: async (data, transaction) => {
        try {
            const newAttendance = await attendanceModel_1.default.create(data, { transaction });
            return newAttendance;
        }
        catch (error) {
            throw new Error(`Error creating Attendance: ${error.message}`);
        }
    },
    deleteOne: async (filter) => {
        try {
            const attendance = await attendanceModel_1.default.findOne({ where: filter });
            if (!attendance)
                throw new Error("Attendance not found");
            await attendance.destroy();
            return attendance;
        }
        catch (error) {
            throw new Error(`Error deleting Attendance: ${error.message}`);
        }
    },
    deleteMany: async (filter) => {
        try {
            const affectedRows = await attendanceModel_1.default.destroy({ where: filter });
            return { affectedRows };
        }
        catch (error) {
            throw new Error(`Error deleting Attendances: ${error.message}`);
        }
    },
    getOne: async (filter, projection = null, include = false) => {
        try {
            const attendance = await attendanceModel_1.default.findOne({
                where: filter,
                attributes: projection,
                // include: include ? [
                //   { model: Wallet, as: 'wallet' },
                //   { model: Followers, as: 'userFollowers' },
                //   { model: Followings, as: 'userFollowings' }
                // ] : []
            });
            return attendance;
        }
        catch (error) {
            throw new Error(`Error fetching Attendance: ${error.message}`);
        }
    },
    getMany: async (filter, projection, options) => {
        try {
            const attendance = await attendanceModel_1.default.findAll({
                where: filter,
                attributes: projection,
                ...options,
            });
            return attendance;
        }
        catch (error) {
            throw new Error(`Error fetching Attendances: ${error.message}`);
        }
    },
};
exports.default = {
    attendanceRepositories
};
