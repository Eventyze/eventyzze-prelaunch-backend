"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("../../services");
const utilities_1 = require("../../utilities");
const getAllDyteMeetingsService = utilities_1.errorUtilities.withErrorHandling(async () => {
    const responseHandler = {
        statusCode: 0,
        message: "",
        data: {}
    };
    const dyteEvents = await services_1.dyteServices.getDyteMeetings();
    responseHandler.statusCode = 200;
    responseHandler.message = "Meetings Fetched Successfully";
    responseHandler.data = {
        events: dyteEvents.data
    };
    return responseHandler;
});
exports.default = {
    getAllDyteMeetingsService
};
