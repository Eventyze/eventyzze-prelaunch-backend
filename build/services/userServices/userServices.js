"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = require("../../utilities");
const validator_1 = __importDefault(require("validator"));
const repositories_1 = require("../../repositories");
const i18n_iso_countries_1 = __importDefault(require("i18n-iso-countries"));
const helpers_1 = require("../../helpers");
const iso3166 = require('iso3166-2-db');
const userProfileUpdateService = utilities_1.errorUtilities.withErrorHandling(async (profilePayload) => {
    const responseHandler = {
        statusCode: 0,
        message: "",
        data: {},
        details: {},
        info: {},
    };
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
    responseHandler.statusCode = 200;
    responseHandler.message = "Profile updated successfully";
    responseHandler.data = {
        user: newUser,
    };
    return responseHandler;
});
const updateUserImageService = utilities_1.errorUtilities.withErrorHandling(async (request) => {
    const responseHandler = {
        statusCode: 0,
        message: "",
    };
    const imageUpdate = request?.file?.path;
    console.log('imageUpdate', imageUpdate);
    if (!imageUpdate) {
        throw utilities_1.errorUtilities.createError("Select an Image", 400);
    }
    const { id } = request.user;
    const newMovie = await repositories_1.userRepositories.userRepositories.updateOne({
        id,
    }, {
        userImage: imageUpdate
    });
    responseHandler.statusCode = 200;
    responseHandler.message = "Movie image changed successfully";
    responseHandler.data = {
        mmovie: newMovie,
    };
    return responseHandler;
});
const userfirstimeProfileUpdateService = utilities_1.errorUtilities.withErrorHandling(async (profilePayload) => {
    const responseHandler = {
        statusCode: 0,
        message: "",
        data: {},
        details: {},
        info: {},
    };
    i18n_iso_countries_1.default.registerLocale(require('i18n-iso-countries/langs/en.json'));
    let { id, userName, bio, interests, phone, fullName, state, country, address, stateCode, countryCode } = profilePayload;
    const user = await repositories_1.userRepositories.userRepositories.getOne({ id });
    if (!user) {
        throw utilities_1.errorUtilities.createError("User not found", 404);
    }
    const confirmUserName = await repositories_1.userRepositories.userRepositories.getOne({ userName }, ["userName"]);
    if (confirmUserName) {
        throw utilities_1.errorUtilities.createError("Username unavailable, please choose another username", 409);
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
    responseHandler.statusCode = 200;
    responseHandler.message = "Profile updated successfully";
    responseHandler.data = {
        user: newUser,
    };
    return responseHandler;
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
    const responseHandler = {
        statusCode: 0,
        message: "",
        data: {},
        details: {},
        info: {},
    };
    const events = await repositories_1.eventRepositories.eventRepositories.getMany({ isLive: true });
    if (!events || events.length === 0) {
        responseHandler.statusCode = 404;
        responseHandler.message = "No events found";
        responseHandler.data = {
            events
        };
        return responseHandler;
    }
    responseHandler.statusCode = 200;
    responseHandler.message = "Events fetched successfully";
    responseHandler.data = {
        events
    };
    return responseHandler;
});
const getAllEventsService = utilities_1.errorUtilities.withErrorHandling(async () => {
    const responseHandler = {
        statusCode: 0,
        message: "",
        data: {},
        details: {},
        info: {},
    };
    const events = await repositories_1.eventRepositories.eventRepositories.getMany({});
    if (!events || events.length === 0) {
        responseHandler.statusCode = 404;
        responseHandler.message = "No events found";
        responseHandler.data = {
            events
        };
        return responseHandler;
    }
    responseHandler.statusCode = 200;
    responseHandler.message = "Events fetched successfully";
    responseHandler.data = {
        events
    };
    return responseHandler;
});
exports.default = {
    userProfileUpdateService,
    updateUserImageService,
    userSwitchesToHostService,
    userfirstimeProfileUpdateService,
    getAllLiveEventsService,
    getAllEventsService
};
