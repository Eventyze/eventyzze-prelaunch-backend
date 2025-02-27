"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = require("../../utilities");
const validator_1 = __importDefault(require("validator"));
const repositories_1 = require("../../repositories");
const helpers_1 = require("../../helpers");
const sequelize_1 = require("sequelize");
const response_utilities_1 = __importDefault(require("../../utilities/responseHandlers/response.utilities"));
const constants_1 = require("../../constants");
const userServiceResponses_1 = require("../../types/responseTypes/userServiceResponses");
const userProfileUpdateService = utilities_1.errorUtilities.withErrorHandling(async (profilePayload) => {
    const { body } = profilePayload;
    const { id } = profilePayload;
    const user = await repositories_1.userRepositories.userRepositories.getOne({ id });
    if ((!body.userName || body.userName === "") &&
        (!body.bio || body.bio === "") &&
        (!body.interests ||
            !Array.isArray(body.interests) ||
            body.interests.length === 0) &&
        (!body.phone || body.phone === "") &&
        (!body.fullName || body.fullName === "") &&
        (!body.address || body.address === "")) {
        throw utilities_1.errorUtilities.createError(userServiceResponses_1.UserResponses.SELECT_A_FIELD, constants_1.StatusCodes.StatusCodes.BAD_REQUEST);
    }
    let updateDetails = {};
    if (body.userName) {
        if (body.userName === user.userName) {
            throw utilities_1.errorUtilities.createError(userServiceResponses_1.UserResponses.SELECT_DIFFERENT_USERNAME, constants_1.StatusCodes.StatusCodes.BAD_REQUEST);
        }
        const confirmUserName = await repositories_1.userRepositories.userRepositories.getOne({ userName: body.userName }, [constants_1.DatabaseConstants.DatabaseProjection.USERNAME]);
        if (confirmUserName) {
            throw utilities_1.errorUtilities.createError(userServiceResponses_1.UserResponses.UNAVAILABLE_USER_NAME, constants_1.StatusCodes.StatusCodes.BAD_REQUEST);
        }
        updateDetails.userName = body.userName;
    }
    if (body.bio) {
        updateDetails.bio = body.bio.trim();
    }
    if (body.interests) {
        updateDetails.interests = body.interests;
    }
    if (body.phone) {
        if (!validator_1.default.isMobilePhone(body.phone, "any")) {
            throw utilities_1.errorUtilities.createError(userServiceResponses_1.UserResponses.INVALID_PHONE, constants_1.StatusCodes.StatusCodes.BAD_REQUEST);
        }
        updateDetails.phone = body.phone.trim();
    }
    if (body.fullName) {
        updateDetails.fullName = body.fullName.trim();
    }
    if (body.country) {
        updateDetails.country = body.country.trim();
    }
    if (body.state) {
        updateDetails.country = body.country.trim();
    }
    if (body.address) {
        updateDetails.address = body.address.trim();
    }
    const newUser = await repositories_1.userRepositories.userRepositories.updateOne({ id }, updateDetails);
    return response_utilities_1.default.handleServicesResponse(constants_1.StatusCodes.StatusCodes.OK, userServiceResponses_1.UserResponses.SUCCESSFULY_PROFILE_CREATION, newUser);
});
const updateUserImageService = utilities_1.errorUtilities.withErrorHandling(async (imageUrl, id) => {
    if (!imageUrl) {
        throw utilities_1.errorUtilities.createError(userServiceResponses_1.UserResponses.SELECT_AN_IMAGE, constants_1.StatusCodes.StatusCodes.BAD_REQUEST);
    }
    const newUserImage = await repositories_1.userRepositories.userRepositories.updateOne({
        id,
    }, {
        userImage: imageUrl,
    });
    return response_utilities_1.default.handleServicesResponse(constants_1.StatusCodes.StatusCodes.OK, userServiceResponses_1.UserResponses.USER_IMAGE_UPDATE_SUCCESS, newUserImage);
});
const userfirstimeProfileUpdateService = utilities_1.errorUtilities.withErrorHandling(async (profilePayload) => {
    let { id, userName, bio, interests, phone, fullName, state, country, address, stateCode, countryCode, deviceId, } = profilePayload;
    const user = (await repositories_1.userRepositories.userRepositories.getOne({
        id,
    }));
    if (!user) {
        throw utilities_1.errorUtilities.createError(userServiceResponses_1.UserResponses.NOT_FOUND, constants_1.StatusCodes.StatusCodes.NOT_FOUND);
    }
    if (!validator_1.default.isMobilePhone(phone, "any")) {
        throw utilities_1.errorUtilities.createError(userServiceResponses_1.UserResponses.INVALID_PHONE, constants_1.StatusCodes.StatusCodes.BAD_REQUEST);
    }
    let userEventyzzeId;
    try {
        userEventyzzeId = await helpers_1.generalHelpers.generateUniqueUserEventyzzeId(countryCode, stateCode);
    }
    catch (error) {
        throw utilities_1.errorUtilities.createError(userServiceResponses_1.UserResponses.EVENTYZZE_ID_GENERATE_FAILURE, constants_1.StatusCodes.StatusCodes.INTERNAL_SERVER_ERROR);
    }
    const tokenPayload = {
        id: user.id,
        email: user.email,
        role: user.role,
    };
    const accessToken = await helpers_1.generalHelpers.generateTokens(tokenPayload, "2h");
    const refreshToken = await helpers_1.generalHelpers.generateTokens(tokenPayload, "30d");
    if (!user.refreshToken || !user.isInitialProfileSetupDone) {
        let mailMessage = constants_1.EmailConstants.generateMessages().FIRST_PROFILE_UPDATE_SUCCESSFUL(user.fullName);
        let mailSubject = `${constants_1.EmailConstants.MailSubjects.WELCOME} ${user.fullName ? user.fullName : ""}`;
        await utilities_1.mailUtilities.sendMail(user.email, mailMessage, mailSubject);
    }
    profilePayload.eventyzzeId = userEventyzzeId;
    profilePayload.isInitialProfileSetupDone = true;
    profilePayload.refreshToken = refreshToken;
    profilePayload.activeDeviceId = deviceId;
    const newUser = await repositories_1.userRepositories.userRepositories.updateOne({ id }, profilePayload);
    const userData = { user: newUser, accessToken, refreshToken };
    return response_utilities_1.default.handleServicesResponse(constants_1.StatusCodes.StatusCodes.OK, userServiceResponses_1.UserResponses.SUCCESSFULY_PROFILE_CREATION, userData);
});
const confirmUserNameService = utilities_1.errorUtilities.withErrorHandling(async (userName) => {
    const confirmUserName = await repositories_1.userRepositories.userRepositories.getOne({ userName }, [constants_1.DatabaseConstants.DatabaseProjection.USERNAME]);
    if (confirmUserName) {
        throw utilities_1.errorUtilities.createError(userServiceResponses_1.UserResponses.UNAVAILABLE_USER_NAME, constants_1.StatusCodes.StatusCodes.BAD_REQUEST);
    }
    return response_utilities_1.default.handleServicesResponse(constants_1.StatusCodes.StatusCodes.OK, userServiceResponses_1.UserResponses.AVAILABLE_USERNAME);
});
const userSwitchesToHostService = utilities_1.errorUtilities.withErrorHandling(async (userPayload) => {
    return response_utilities_1.default.handleServicesResponse(constants_1.StatusCodes.StatusCodes.OK, userServiceResponses_1.UserResponses.AVAILABLE_USERNAME);
    ;
});
const getAllLiveEventsService = utilities_1.errorUtilities.withErrorHandling(async () => {
    const projection = [
        constants_1.DatabaseConstants.DatabaseProjection.ID,
        constants_1.DatabaseConstants.DatabaseProjection.EVENT_TITLE,
        constants_1.DatabaseConstants.DatabaseProjection.EVENT_OWNER_NAME,
        constants_1.DatabaseConstants.DatabaseProjection.EVENT_COVER_IMAGE,
        constants_1.DatabaseConstants.DatabaseProjection.EVENT_IS_LIVE,
    ];
    const events = await repositories_1.eventRepositories.eventRepositories.getMany({
    // isLive: true,
    }, projection);
    if (!events) {
        throw utilities_1.errorUtilities.createError(userServiceResponses_1.UserResponses.UNABLE_TO_FETCH_EVENTS, constants_1.StatusCodes.StatusCodes.NOT_FOUND);
    }
    return response_utilities_1.default.handleServicesResponse(constants_1.StatusCodes.StatusCodes.OK, userServiceResponses_1.UserResponses.LIVE_EVENTS_FETCHED_SUCCESSFULLY, events);
});
const getNewEvents = utilities_1.errorUtilities.withErrorHandling(async () => {
    const projection = [
        constants_1.DatabaseConstants.DatabaseProjection.ID,
        constants_1.DatabaseConstants.DatabaseProjection.EVENT_TITLE,
        constants_1.DatabaseConstants.DatabaseProjection.EVENT_OWNER_NAME,
        constants_1.DatabaseConstants.DatabaseProjection.EVENT_COVER_IMAGE,
        constants_1.DatabaseConstants.DatabaseProjection.EVENT_IS_LIVE,
    ];
    const events = await repositories_1.eventRepositories.eventRepositories.getMany({}, projection, {}, [
        [
            constants_1.DatabaseConstants.DatabaseProjection.CREATED_AT,
            constants_1.DatabaseConstants.DatabaseCadre.DESC,
        ],
    ]);
    if (!events) {
        throw utilities_1.errorUtilities.createError(userServiceResponses_1.UserResponses.UNABLE_TO_FETCH_EVENTS, constants_1.StatusCodes.StatusCodes.NOT_FOUND);
    }
    return response_utilities_1.default.handleServicesResponse(constants_1.StatusCodes.StatusCodes.OK, userServiceResponses_1.UserResponses.NEW_EVENTS_FETCHED_SUCCESSFULLY, events);
});
const getDiscoverEvents = utilities_1.errorUtilities.withErrorHandling(async (userId) => {
    const user = (await repositories_1.userRepositories.userRepositories.getOne({ id: userId }, [constants_1.DatabaseConstants.DatabaseProjection.INTERESTS, constants_1.DatabaseConstants.DatabaseProjection.ID]));
    const events = await repositories_1.eventRepositories.eventRepositories.getMany({
        category: { [sequelize_1.Op.overlap]: user.interests },
    });
    if (!events) {
        throw utilities_1.errorUtilities.createError(userServiceResponses_1.UserResponses.UNABLE_TO_FETCH_EVENTS, constants_1.StatusCodes.StatusCodes.NOT_FOUND);
    }
    return response_utilities_1.default.handleServicesResponse(constants_1.StatusCodes.StatusCodes.OK, userServiceResponses_1.UserResponses.EVENTS_FETCHED_SUCCESSFULLY, events);
});
const getRecordedEvents = utilities_1.errorUtilities.withErrorHandling(async () => {
    const projection = [
        constants_1.DatabaseConstants.DatabaseProjection.ID,
        constants_1.DatabaseConstants.DatabaseProjection.EVENT_TITLE,
        constants_1.DatabaseConstants.DatabaseProjection.EVENT_OWNER_NAME,
        constants_1.DatabaseConstants.DatabaseProjection.EVENT_COVER_IMAGE,
        constants_1.DatabaseConstants.DatabaseProjection.EVENT_IS_LIVE,
    ];
    const events = await repositories_1.eventRepositories.eventRepositories.getMany({
        isRecorded: true,
    }, projection);
    if (!events) {
        throw utilities_1.errorUtilities.createError(userServiceResponses_1.UserResponses.UNABLE_TO_FETCH_EVENTS, constants_1.StatusCodes.StatusCodes.NOT_FOUND);
    }
    return response_utilities_1.default.handleServicesResponse(constants_1.StatusCodes.StatusCodes.OK, userServiceResponses_1.UserResponses.RECORDED_EVENTS_FETCHED_SUCCESSFULLY, events);
});
const getAllEvents = utilities_1.errorUtilities.withErrorHandling(async () => {
    const events = await repositories_1.eventRepositories.eventRepositories.getMany({});
    if (!events) {
        throw utilities_1.errorUtilities.createError(userServiceResponses_1.UserResponses.UNABLE_TO_FETCH_EVENTS, constants_1.StatusCodes.StatusCodes.NOT_FOUND);
    }
    return response_utilities_1.default.handleServicesResponse(constants_1.StatusCodes.StatusCodes.OK, userServiceResponses_1.UserResponses.EVENTS_FETCHED_SUCCESSFULLY, events);
});
const getTrendingEvents = utilities_1.errorUtilities.withErrorHandling(async () => {
    const projection = [
        constants_1.DatabaseConstants.DatabaseProjection.ID,
        constants_1.DatabaseConstants.DatabaseProjection.EVENT_TITLE,
        constants_1.DatabaseConstants.DatabaseProjection.EVENT_OWNER_NAME,
        constants_1.DatabaseConstants.DatabaseProjection.EVENT_COVER_IMAGE,
        constants_1.DatabaseConstants.DatabaseProjection.EVENT_IS_LIVE,
    ];
    const events = await repositories_1.eventRepositories.eventRepositories.getMany({}, projection, {}, [
        [
            constants_1.DatabaseConstants.DatabaseProjection.EVENT_NO_OF_LIKES,
            constants_1.DatabaseConstants.DatabaseCadre.DESC,
        ],
    ]);
    if (!events) {
        throw utilities_1.errorUtilities.createError(userServiceResponses_1.UserResponses.UNABLE_TO_FETCH_EVENTS, constants_1.StatusCodes.StatusCodes.NOT_FOUND);
    }
    return response_utilities_1.default.handleServicesResponse(constants_1.StatusCodes.StatusCodes.OK, userServiceResponses_1.UserResponses.TRENDING_EVENTS_FETCHED_SUCCESSFULLY, events);
});
exports.default = {
    userProfileUpdateService,
    updateUserImageService,
    userSwitchesToHostService,
    userfirstimeProfileUpdateService,
    getAllLiveEventsService,
    getNewEvents,
    getDiscoverEvents,
    getRecordedEvents,
    getAllEvents,
    confirmUserNameService,
    getTrendingEvents,
};
