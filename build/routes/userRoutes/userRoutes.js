"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validations_1 = require("../../validations");
const controllers_1 = require("../../controllers");
const authorization_middleware_1 = require("../../middlewares/authorization.middleware");
const utilities_1 = require("../../utilities");
const router = express_1.default.Router();
//User Email Authentications and profile updates
router.post('/email-signup', validations_1.joiValidators.inputValidator(validations_1.joiValidators.userRegisterSchemaViaEmail), controllers_1.userAuthController.userRegisterWithEmail);
router.post('/verify-otp', validations_1.joiValidators.inputValidator(validations_1.joiValidators.verifyOtpSchema), controllers_1.userAuthController.userVerifiesOtp);
router.post('/email-login', validations_1.joiValidators.inputValidator(validations_1.joiValidators.loginUserSchemaViaEmail), controllers_1.userAuthController.userLoginWithEmail);
router.get('/resend-otp', controllers_1.userAuthController.userResendsOtp);
router.put('/profile-update', authorization_middleware_1.generalAuthFunction, controllers_1.userController.updateUserProfile);
router.put('/image-upload', authorization_middleware_1.generalAuthFunction, utilities_1.cloudinaryUpload, controllers_1.userController.changeUserImage);
router.post('/google-auth', validations_1.joiValidators.inputValidator(validations_1.joiValidators.googleAuthSchema), controllers_1.userAuthController.googleAuth);
router.post('/facebook-auth', validations_1.joiValidators.inputValidator(validations_1.joiValidators.facebookAuthSchema), controllers_1.userAuthController.facebookAuth);
router.post('/request-password-reset', validations_1.joiValidators.inputValidator(validations_1.joiValidators.requestPasswordResetSchema), controllers_1.userAuthController.requestPasswordReset);
router.post('/reset-password', validations_1.joiValidators.inputValidator(validations_1.joiValidators.resetPasswordSchema), controllers_1.userAuthController.resetPassword);
exports.default = router;
