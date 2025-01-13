"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W]{8,}$/;
const inputValidator = (schema) => {
    return async (request, response, next) => {
        try {
            const { error } = schema.validate(request.body);
            if (error) {
                return response.status(400).json({
                    status: 'error',
                    message: `${error.details[0].message.replace(/["\\]/g, '')}`,
                });
            }
            return next();
        }
        catch (err) {
            return response.status(500).json({
                status: 'error',
                message: 'Internal Server Error',
            });
        }
    };
};
//User Auth
const userRegisterSchemaViaEmail = joi_1.default.object({
    email: joi_1.default.string().trim().email().required(),
    password: joi_1.default.string().trim().min(8).pattern(PASSWORD_PATTERN).required().messages({
        'string.pattern.base': 'Password must contain at least 8 characters comprising of at least one uppercase letter, one lowercase letter, one number and no spaces.'
    }),
});
const verifyOtpSchema = joi_1.default.object({
    email: joi_1.default.string().required(),
    otp: joi_1.default.string().required().min(5)
});
const loginUserSchemaViaEmail = joi_1.default.object({
    email: joi_1.default.string().trim().required().email(),
    password: joi_1.default.string().trim().required()
});
const googleAuthSchema = joi_1.default.object({
    token: joi_1.default.string().required(),
});
const facebookAuthSchema = joi_1.default.object({
    accessToken: joi_1.default.string().required(),
});
const requestPasswordResetSchema = joi_1.default.object({
    email: joi_1.default.string().trim().email().required(),
});
const resetPasswordSchema = joi_1.default.object({
    email: joi_1.default.string().trim().email().required(),
    otp: joi_1.default.string().required().min(5),
    newPassword: joi_1.default.string().trim().min(8).pattern(PASSWORD_PATTERN).required().messages({
        'string.pattern.base': 'Password must contain at least 8 characters comprising of at least one uppercase letter, one lowercase letter, one number and no spaces.'
    }),
});
exports.default = {
    userRegisterSchemaViaEmail,
    loginUserSchemaViaEmail,
    verifyOtpSchema,
    inputValidator,
    googleAuthSchema,
    facebookAuthSchema,
    requestPasswordResetSchema,
    resetPasswordSchema,
};
