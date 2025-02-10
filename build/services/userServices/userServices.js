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
        throw utilities_1.errorUtilities.createError("At least one field must be selected for update", 400);
    }
    let updateDetails = {};
    if (body.userName) {
        if (body.userName === user.userName) {
            throw utilities_1.errorUtilities.createError("This is your current username, please choose another username if you wish to change it", 400);
        }
        const confirmUserName = await repositories_1.userRepositories.userRepositories.getOne({ userName: body.userName }, ["userName"]);
        if (confirmUserName) {
            throw utilities_1.errorUtilities.createError("Username unavailable, please choose another username", 400);
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
            throw utilities_1.errorUtilities.createError("Invalid phone number", 400);
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
    return response_utilities_1.default.handleServicesResponse(200, 'Profile updated successfully', newUser);
});
const updateUserImageService = utilities_1.errorUtilities.withErrorHandling(async (imageUrl, id) => {
    if (!imageUrl) {
        throw utilities_1.errorUtilities.createError("Select an Image", 400);
    }
    const newMovie = await repositories_1.userRepositories.userRepositories.updateOne({
        id,
    }, {
        userImage: imageUrl
    });
    return response_utilities_1.default.handleServicesResponse(200, 'Movie image changed successfully', newMovie);
});
const userfirstimeProfileUpdateService = utilities_1.errorUtilities.withErrorHandling(async (profilePayload) => {
    let { id, userName, bio, interests, phone, fullName, state, country, address, stateCode, countryCode } = profilePayload;
    const user = await repositories_1.userRepositories.userRepositories.getOne({ id });
    if (!user) {
        throw utilities_1.errorUtilities.createError("User not found", 404);
    }
    if (!validator_1.default.isMobilePhone(phone, "any")) {
        throw utilities_1.errorUtilities.createError("Invalid phone number", 400);
    }
    let userEventyzzeId;
    try {
        userEventyzzeId = await helpers_1.generalHelpers.generateUniqueUserEventyzzeId(countryCode, stateCode);
    }
    catch (error) {
        throw utilities_1.errorUtilities.createError("Failed to generate unique identifier, please try again", 500);
    }
    profilePayload.eventyzzeId = userEventyzzeId;
    profilePayload.isInitialProfileSetupDone = true;
    const newUser = await repositories_1.userRepositories.userRepositories.updateOne({ id }, profilePayload);
    return response_utilities_1.default.handleServicesResponse(200, 'Profile updated successfully', newUser);
});
const confirmUserNameService = utilities_1.errorUtilities.withErrorHandling(async (userName) => {
    const confirmUserName = await repositories_1.userRepositories.userRepositories.getOne({ userName }, ["userName"]);
    if (confirmUserName) {
        throw utilities_1.errorUtilities.createError("Username unavailable, please choose another username", 400);
    }
    return response_utilities_1.default.handleServicesResponse(200, 'Username Available');
});
const userSwitchesToHostService = utilities_1.errorUtilities.withErrorHandling(async (userPayload) => {
    const responseHandler = {
        statusCode: 0,
        message: "",
        data: {},
        details: {},
        info: {},
    };
    return responseHandler;
});
const getAllLiveEventsService = utilities_1.errorUtilities.withErrorHandling(async () => {
    const events = await repositories_1.eventRepositories.eventRepositories.getMany({ isLive: true });
    if (!events) {
        throw utilities_1.errorUtilities.createError("Unable to fetch Events", 404);
    }
    return response_utilities_1.default.handleServicesResponse(200, 'Live Events fetched successfully', events);
});
const getNewEvents = utilities_1.errorUtilities.withErrorHandling(async () => {
    const events = await repositories_1.eventRepositories.eventRepositories.getMany({}, null, {}, [["createdAt", "DESC"]]);
    if (!events) {
        throw utilities_1.errorUtilities.createError("Unable to fetch Events", 404);
    }
    return response_utilities_1.default.handleServicesResponse(200, "New Events fetched successfully", events);
});
const getDiscoverEvents = utilities_1.errorUtilities.withErrorHandling(async (userId) => {
    const user = await repositories_1.userRepositories.userRepositories.getOne({ id: userId }, ["interests", "id"]);
    const events = await repositories_1.eventRepositories.eventRepositories.getMany({ category: { [sequelize_1.Op.overlap]: user.interests } });
    if (!events) {
        throw utilities_1.errorUtilities.createError("Unable to fetch Events", 404);
    }
    return response_utilities_1.default.handleServicesResponse(200, "Events fetched successfully", events);
});
const getRecordedEvents = utilities_1.errorUtilities.withErrorHandling(async () => {
    const events = await repositories_1.eventRepositories.eventRepositories.getMany({ isRecorded: true });
    if (!events) {
        throw utilities_1.errorUtilities.createError("Unable to fetch Events", 404);
    }
    return response_utilities_1.default.handleServicesResponse(200, "Recorded Events fetched successfully", events);
});
const getAllEvents = utilities_1.errorUtilities.withErrorHandling(async () => {
    const events = await repositories_1.eventRepositories.eventRepositories.getMany({});
    if (!events) {
        throw utilities_1.errorUtilities.createError("Unable to fetch Events", 404);
    }
    return response_utilities_1.default.handleServicesResponse(200, "All Events fetched successfully", events);
});
const getTrendingEvents = utilities_1.errorUtilities.withErrorHandling(async (req, res) => {
    const events = await repositories_1.eventRepositories.eventRepositories.getMany({}, null, {}, [["noOfLikes", "DESC"]]);
    if (!events)
        return response_utilities_1.default.handleServicesResponse(404, "Unable to fetch events", null);
    return response_utilities_1.default.handleServicesResponse(200, "Trending Events fetched successfully", events);
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
    getTrendingEvents
};
