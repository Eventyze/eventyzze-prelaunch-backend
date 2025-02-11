"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FLUTTERWAVE_CALLBACK_URL = exports.FLUTTERWAVE_TEST_ENCRYPTION_KEY = exports.FLUTTERWAVE_TEST_SECRET_KEY = exports.FLUTTERWAVE_TEST_PUBLIC_KEY = exports.AGORA_SECRET = exports.AGORA_KEY = exports.AGORA_APP_ID = exports.AGORA_PRIMARY_CERTIFICATE_KEY = exports.DYTE_API_KEY = exports.DYTE_ORGANIZATION_ID = exports.DYTE_BASE_URL = exports.FACEBOOK_APP_SECRET = exports.FACEBOOK_APP_ID = exports.GOOGLE_CLIENT_SECRET = exports.GOOGLE_CLIENT_ID = exports.CLOUDINARY_API_SECRET = exports.CLOUDINARY_API_KEY = exports.CLOUDINARY_NAME = exports.GMAIL_PASSWORD = exports.GMAIL_USER = exports.USERS_APP_BASE_URL = exports.APP_SECRET = void 0;
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
//DYTE
exports.DYTE_BASE_URL = process.env.DYTE_BASE_URL;
exports.DYTE_ORGANIZATION_ID = process.env.DYTE_ORGANIZATION_ID;
exports.DYTE_API_KEY = process.env.DYTE_API_KEY;
//AGORA
exports.AGORA_PRIMARY_CERTIFICATE_KEY = process.env.AGORA_PRIMARY_CERTIFICATE_KEY;
exports.AGORA_APP_ID = process.env.AGORA_APP_ID;
exports.AGORA_KEY = process.env.AGORA_KEY;
exports.AGORA_SECRET = process.env.AGORA_SECRET;
//FLUTTERWAVE
exports.FLUTTERWAVE_TEST_PUBLIC_KEY = process.env.FLUTTERWAVE_TEST_PUBLIC_KEY;
exports.FLUTTERWAVE_TEST_SECRET_KEY = process.env.FLUTTERWAVE_TEST_SECRET_KEY;
exports.FLUTTERWAVE_TEST_ENCRYPTION_KEY = process.env.FLUTTERWAVE_TEST_ENCRYPTION_KEY;
exports.FLUTTERWAVE_CALLBACK_URL = process.env.FLUTTERWAVE_CALLBACK_URL;
