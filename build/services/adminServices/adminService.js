"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("../../services");
const utilities_1 = require("../../utilities");
const adminServiceResponses_1 = require("../../types/responseTypes/adminServiceResponses");
const constants_1 = require("../../constants");
const response_utilities_1 = __importDefault(require("../../utilities/responseHandlers/response.utilities"));
const getAllDyteMeetingsService = utilities_1.errorUtilities.withErrorHandling(async () => {
    const dyteEvents = await services_1.dyteServices.getDyteMeetings();
    return response_utilities_1.default.handleServicesResponse(constants_1.StatusCodes.StatusCodes.OK, adminServiceResponses_1.AdminServiceResponses.MEETINGS_FETCHED_SUCCESSFULLY, {
        events: dyteEvents.data,
    });
});
exports.default = {
    getAllDyteMeetingsService,
};
