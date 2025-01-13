"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("../../services");
const utilities_1 = require("../../utilities");
const allHosts = async (request, response) => {
    const newUser = await services_1.hostServices.getAllHostsService();
    return utilities_1.responseUtilities.responseHandler(response, newUser.message, newUser.statusCode, newUser.details, newUser.data);
};
exports.default = {
    allHosts,
};
