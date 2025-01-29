"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("../../services");
const utilities_1 = require("../../utilities");
const allHosts = async (request, response) => {
    const newUser = await services_1.hostServices.getAllHostsService();
    return utilities_1.responseUtilities.responseHandler(response, newUser.message, newUser.statusCode, newUser.data);
};
const hostCreatesEvent = async (request, response) => {
    const userId = request.user.id;
    const newEvent = await services_1.hostServices.hostCreatesEventService(userId, request.body);
    return utilities_1.responseUtilities.responseHandler(response, newEvent.message, newEvent.statusCode, newEvent.data);
};
exports.default = {
    allHosts,
    hostCreatesEvent
};
