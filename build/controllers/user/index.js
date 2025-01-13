"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("../../services");
const utilities_1 = require("../../utilities");
const updateUserProfile = async (request, response) => {
    const { id } = request.user;
    const newUser = await services_1.userServices.userProfileUpdateService({ ...request.body, id });
    return utilities_1.responseUtilities.responseHandler(response, newUser.message, newUser.statusCode, newUser.details, newUser.data);
};
const changeUserImage = async (request, response) => {
    const newUserImage = await services_1.userServices.updateUserImageService(request);
    return utilities_1.responseUtilities.responseHandler(response, newUserImage.message, newUserImage.statusCode, newUserImage.data, newUserImage.details);
};
exports.default = {
    updateUserProfile,
    changeUserImage
};
