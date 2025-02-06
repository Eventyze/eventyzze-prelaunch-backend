"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("../../services");
const utilities_1 = require("../../utilities");
const updateUserProfile = async (request, response) => {
    const { id } = request.user;
    const newUser = await services_1.userServices.userProfileUpdateService({ ...request.body, id });
    return utilities_1.responseUtilities.responseHandler(response, newUser.message, newUser.statusCode, newUser.data);
};
const firstTimeProfileUpdate = async (request, response) => {
    const { id } = request.user;
    const newUpdate = await services_1.userServices.userfirstimeProfileUpdateService({ ...request.body, id });
    return utilities_1.responseUtilities.responseHandler(response, newUpdate.message, newUpdate.statusCode, newUpdate.data);
};
const changeUserImage = async (request, response) => {
    const { id } = request.user;
    const imageUrl = request?.files?.['image'] ? request.files['image'][0].path : null;
    const newUserImage = await services_1.userServices.updateUserImageService(imageUrl, id);
    return utilities_1.responseUtilities.responseHandler(response, newUserImage.message, newUserImage.statusCode, newUserImage.data);
};
const confirmUserName = async (request, response) => {
    const { userName } = request.query;
    const userNameConfirmation = await services_1.userServices.confirmUserNameService(userName);
    return utilities_1.responseUtilities.responseHandler(response, userNameConfirmation.message, userNameConfirmation.statusCode);
};
exports.default = {
    updateUserProfile,
    changeUserImage,
    firstTimeProfileUpdate,
    confirmUserName
};
