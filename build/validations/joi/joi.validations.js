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
            console.log('bod', request.body.body);
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
    otp: joi_1.default.string().required().messages({
        'string.email': 'OTP is required',
    }).min(5)
});
const loginUserSchemaViaEmail = joi_1.default.object({
    email: joi_1.default.string().trim().required().email().messages({
        'string.email': 'Email is required',
    }),
    password: joi_1.default.string().trim().required().messages({
        'string.base': 'password is required',
    }),
    deviceId: joi_1.default.string().required()
});
const googleAuthSchema = joi_1.default.object({
    token: joi_1.default.string().required(),
});
const facebookAuthSchema = joi_1.default.object({
    accessToken: joi_1.default.string().required(),
});
const requestPasswordResetSchema = joi_1.default.object({
    email: joi_1.default.string().trim().email().required().messages({
        'string.email': 'Email is required',
    }),
});
const resetPasswordSchema = joi_1.default.object({
    email: joi_1.default.string().trim().email().required().messages({
        'string.email': 'Email is required',
    }),
    otp: joi_1.default.string().required().min(5),
    newPassword: joi_1.default.string().trim().min(8).pattern(PASSWORD_PATTERN).required().messages({
        'string.pattern.base': 'Password must contain at least 8 characters comprising of at least one uppercase letter, one lowercase letter, one number and no spaces.'
    }),
});
const firstTimeProfileUpdateSchema = joi_1.default.object({
    userName: joi_1.default.string().trim().required().messages({
        'string.base': 'userName is required'
    }),
    bio: joi_1.default.string().trim().required().messages({
        'string.base': 'bio is required'
    }),
    interests: joi_1.default.array().required().messages({
        'string.base': 'interests are required'
    }),
    phone: joi_1.default.string().trim().required().messages({
        'string.base': 'phone is required'
    }),
    fullName: joi_1.default.string().trim().required().messages({
        'string.base': "fullName is required"
    }),
    state: joi_1.default.string().trim().required().messages({
        'string.base': 'state is required'
    }),
    country: joi_1.default.string().trim().required().messages({
        'string.base': 'country is required'
    }),
    address: joi_1.default.string().trim().required().messages({
        'string.base': 'address is required'
    }),
    stateCode: joi_1.default.string().trim().required().messages({
        'string.base': 'state is required'
    }),
    countryCode: joi_1.default.string().trim().required().messages({
        'string.base': 'country is required'
    }),
    deviceId: joi_1.default.string().trim().optional()
});
const createEventSchema = joi_1.default.object({
    eventTitle: joi_1.default.string().trim().required().messages({
        'string.base': 'Event title is required'
    }),
    description: joi_1.default.string().trim().required().messages({
        'string.base': 'Event description is required'
    }),
    startDate: joi_1.default.string().trim().required().messages({
        'string.base': 'Event start date is required'
    }),
    eventTime: joi_1.default.string().trim().required().messages({
        'string.base': 'Event start time is required'
    }),
    duration: joi_1.default.string().trim().required(),
    endTime: joi_1.default.string().trim().required().messages({
        'string.base': 'Event end time is required'
    }),
    cost: joi_1.default.string().trim().required().messages({
        'string.base': 'Event ticket cost is required'
    }),
    coverImage: joi_1.default.string().trim().required().messages({
        'string.base': 'Event cover image/banner is required'
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
    createEventSchema,
    firstTimeProfileUpdateSchema
};
