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
    console.log('buddie', request.body);
    const newUpdate = await services_1.userServices.userfirstimeProfileUpdateService({ ...request.body, id });
    if (newUpdate.statusCode === 200) {
        response
            .header("x-access-token", newUpdate.data.accessToken)
            .header("x-refresh-token", newUpdate.data.refreshToken);
    }
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
const liveEvents = async (request, response) => {
    const liveEvents = await services_1.userServices.getAllLiveEventsService();
    return utilities_1.responseUtilities.responseHandler(response, liveEvents.message, liveEvents.statusCode, liveEvents.data);
};
const newEvents = async (request, response) => {
    const newEvents = await services_1.userServices.getNewEvents();
    return utilities_1.responseUtilities.responseHandler(response, newEvents.message, newEvents.statusCode, newEvents.data);
};
const eventsOfInterests = async (request, response) => {
    const interestEvents = await services_1.userServices.getDiscoverEvents();
    return utilities_1.responseUtilities.responseHandler(response, interestEvents.message, interestEvents.statusCode, interestEvents.data);
};
const recordedEvents = async (request, response) => {
    const recordedEvents = await services_1.userServices.getRecordedEvents();
    return utilities_1.responseUtilities.responseHandler(response, recordedEvents.message, recordedEvents.statusCode, recordedEvents.data);
};
const allEvents = async (request, response) => {
    const allEvents = await services_1.userServices.getAllEvents();
    return utilities_1.responseUtilities.responseHandler(response, allEvents.message, allEvents.statusCode, allEvents.data);
};
const trendingEvents = async (request, response) => {
    const trendingEvents = await services_1.userServices.getTrendingEvents();
    return utilities_1.responseUtilities.responseHandler(response, trendingEvents.message, trendingEvents.statusCode, trendingEvents.data);
};
exports.default = {
    updateUserProfile,
    changeUserImage,
    firstTimeProfileUpdate,
    confirmUserName,
    liveEvents,
    newEvents,
    eventsOfInterests,
    recordedEvents,
    allEvents,
    trendingEvents
};
