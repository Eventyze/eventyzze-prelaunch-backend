"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("../../services");
const utilities_1 = require("../../utilities");
const allDyteMeetings = async (request, response) => {
    const allEvents = await services_1.adminService.getAllDyteMeetingsService();
    return utilities_1.responseUtilities.responseHandler(response, allEvents.message, allEvents.statusCode, allEvents.data);
};
exports.default = {
    allDyteMeetings
};
