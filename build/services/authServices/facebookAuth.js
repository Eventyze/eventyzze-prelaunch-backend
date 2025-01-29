"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = require("../../utilities");
const uuid_1 = require("uuid");
const modelTypes_1 = require("../../types/modelTypes");
const helpers_1 = require("../../helpers");
const axios_1 = __importDefault(require("axios"));
const envKeys_1 = require("../../configurations/envKeys");
const repositories_1 = require("../../repositories");
const databaseTransactions_middleware_1 = __importDefault(require("../../middlewares/databaseTransactions.middleware"));
const facebookAuthService = utilities_1.errorUtilities.withErrorHandling(async (accessToken) => {
    const responseHandler = {
        statusCode: 0,
        message: "",
        data: {},
        details: {},
        info: {},
    };
    // Verify the access token with Facebook
    const appAccessTokenResponse = await axios_1.default.get(`https://graph.facebook.com/oauth/access_token?client_id=${envKeys_1.FACEBOOK_APP_ID}&client_secret=${envKeys_1.FACEBOOK_APP_SECRET}&grant_type=client_credentials`);
    const appAccessToken = appAccessTokenResponse.data.access_token;
    // Debug the access token
    const debugTokenResponse = await axios_1.default.get(`https://graph.facebook.com/debug_token?input_token=${accessToken}&access_token=${appAccessToken}`);
    if (!debugTokenResponse.data.data.is_valid) {
        throw utilities_1.errorUtilities.createError("Invalid Facebook token", 400);
    }
    // Get user data from Facebook
    const userDataResponse = await axios_1.default.get(`https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`);
    const { email, name, picture } = userDataResponse.data;
    if (!email) {
        throw utilities_1.errorUtilities.createError("Email not provided from Facebook", 400);
    }
    const existingUser = await repositories_1.userRepositories.userRepositories.getOne({ email });
    if (existingUser) {
        const tokenPayload = {
            id: existingUser.id,
            email: existingUser.email,
            role: existingUser.role,
        };
        const accessToken = await helpers_1.generalHelpers.generateTokens(tokenPayload, "2h");
        const refreshToken = await helpers_1.generalHelpers.generateTokens(tokenPayload, "30d");
        existingUser.refreshToken = refreshToken;
        await existingUser.save();
        const userWithoutPassword = await repositories_1.userRepositories.userRepositories.extractUserDetails(existingUser);
        responseHandler.statusCode = 200;
        responseHandler.message = "Login successful";
        responseHandler.data = {
            user: userWithoutPassword,
            accessToken,
            refreshToken,
        };
        return responseHandler;
    }
    // Create new user
    const userId = (0, uuid_1.v4)();
    const walletPayload = {
        id: (0, uuid_1.v4)(),
        userId,
        totalBalance: 0,
    };
    const followersPayload = {
        id: (0, uuid_1.v4)(),
        userId,
        followers: [],
    };
    const followingsPayload = {
        id: (0, uuid_1.v4)(),
        userId,
        followings: [],
    };
    const userCreationPayload = {
        id: userId,
        email,
        fullName: name,
        userImage: picture?.data?.url, // Facebook returns picture in a different format
        isVerified: true,
        role: modelTypes_1.Roles.User,
    };
    const operations = [
        async (transaction) => {
            await repositories_1.userRepositories.userRepositories.create(userCreationPayload, transaction);
        },
        async (transaction) => {
            await repositories_1.walletRepositories.walletRepositories.create(walletPayload, transaction);
        },
        async (transaction) => {
            await repositories_1.folowersRepositories.followersRepositories.create(followersPayload, transaction);
        },
        async (transaction) => {
            await repositories_1.followingsRepositories.followingsRepositories.create(followingsPayload, transaction);
        },
    ];
    await databaseTransactions_middleware_1.default.performTransaction(operations);
    const newUser = await repositories_1.userRepositories.userRepositories.getOne({ id: userId });
    const tokenPayload = {
        id: userId,
        email,
        role: modelTypes_1.Roles.User,
    };
    const jwtAccessToken = await helpers_1.generalHelpers.generateTokens(tokenPayload, "2h");
    const refreshToken = await helpers_1.generalHelpers.generateTokens(tokenPayload, "30d");
    newUser.refreshToken = refreshToken;
    await newUser.save();
    const userWithoutPassword = await repositories_1.userRepositories.userRepositories.extractUserDetails(newUser);
    responseHandler.statusCode = 201;
    responseHandler.message = "Account created successfully";
    responseHandler.data = {
        user: userWithoutPassword,
        accessToken: jwtAccessToken,
        refreshToken,
    };
    return responseHandler;
});
exports.default = {
    facebookAuthService,
};
