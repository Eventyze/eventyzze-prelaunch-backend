"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FACEBOOK_APP_SECRET = exports.FACEBOOK_APP_ID = exports.GOOGLE_CLIENT_SECRET = exports.GOOGLE_CLIENT_ID = exports.CLOUDINARY_API_SECRET = exports.CLOUDINARY_API_KEY = exports.CLOUDINARY_NAME = exports.GMAIL_PASSWORD = exports.GMAIL_USER = exports.USERS_APP_BASE_URL = exports.APP_SECRET = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// GENERAL SECRETS
exports.APP_SECRET = process.env.APP_SECRET;
exports.USERS_APP_BASE_URL = process.env.USERS_APP_BASE_URL;
//SMTP SECRETS
exports.GMAIL_USER = process.env.GMAIL_USER;
exports.GMAIL_PASSWORD = process.env.GMAIL_PASSWORD;
//CLOUDINARY SECRETS
exports.CLOUDINARY_NAME = process.env.CLOUDINARY_NAME;
exports.CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
exports.CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
//GOOGLE SECRETS
exports.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
exports.GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
//FACEBOOK SECRETS
exports.FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
exports.FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;
