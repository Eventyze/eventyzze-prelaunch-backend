"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const eventsModel_1 = __importDefault(require("../../models/events/eventsModel"));
const walletModel_1 = __importDefault(require("../../models/wallets/walletModel"));
const eventRepositories = {
    create: async (data, transaction) => {
        try {
            const newEvent = await eventsModel_1.default.create(data, { transaction });
            return newEvent;
        }
        catch (error) {
            throw new Error(`Error creating Event: ${error.message}`);
        }
    },
    updateOne: async (filter, update, transaction) => {
        try {
            const event = await eventsModel_1.default.findOne({ where: filter });
            await event.update(update, { transaction });
            return event;
        }
        catch (error) {
            throw new Error(`Error updating Event: ${error.message}`);
        }
    },
    deleteOne: async (filter) => {
        try {
            const event = await eventsModel_1.default.findOne({ where: filter });
            if (!event)
                throw new Error("Event not found");
            await event.destroy();
            return event;
        }
        catch (error) {
            throw new Error(`Error deleting Event: ${error.message}`);
        }
    },
    deleteMany: async (filter) => {
        try {
            const affectedRows = await eventsModel_1.default.destroy({ where: filter });
            return { affectedRows };
        }
        catch (error) {
            throw new Error(`Error deleting Events: ${error.message}`);
        }
    },
    getOne: async (filter, projection = null, include = false) => {
        try {
            const event = await eventsModel_1.default.findOne({
                where: filter,
                attributes: projection,
                include: include ? [
                    { model: walletModel_1.default, as: 'wallet' },
                ] : []
            });
            return event;
        }
        catch (error) {
            throw new Error(`Error fetching Event: ${error.message}`);
        }
    },
    getMany: async (filter, projection = null, options = null) => {
        try {
            const events = await eventsModel_1.default.findAll({
                where: filter,
                attributes: projection ? projection : null,
                ...options,
            });
            return events;
        }
        catch (error) {
            throw new Error(`Error fetching Events: ${error.message}`);
        }
    },
};
exports.default = {
    eventRepositories,
};
