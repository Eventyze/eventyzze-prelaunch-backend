import express from 'express';
import { joiValidators } from '../../validations';
import { userAuthController, userController } from '../../controllers';
import { generalAuthFunction } from '../../middlewares/authorization.middleware';
import { cloudinaryUpload } from '../../utilities';

const router = express.Router();

//User Email Authentications and profile updates
router.post('/email-signup', joiValidators.inputValidator(joiValidators.userRegisterSchemaViaEmail), userAuthController.userRegisterWithEmail)
router.post('/verify-otp', joiValidators.inputValidator(joiValidators.verifyOtpSchema), userAuthController.userVerifiesOtp)
router.post('/email-login', joiValidators.inputValidator(joiValidators.loginUserSchemaViaEmail), userAuthController.userLoginWithEmail)
router.get('/resend-otp', userAuthController.userResendsOtp)
router.put('/profile-update', generalAuthFunction, userController.updateUserProfile)
router.put('/first-time-profile-update', joiValidators.inputValidator(joiValidators.firstTimeProfileUpdateSchema), generalAuthFunction, userController.firstTimeProfileUpdate)
router.put('/image-upload', generalAuthFunction, cloudinaryUpload, userController.changeUserImage)
router.post('/google-auth', joiValidators.inputValidator(joiValidators.googleAuthSchema), userAuthController.googleAuth)
router.post('/facebook-auth', joiValidators.inputValidator(joiValidators.facebookAuthSchema), userAuthController.facebookAuth)
router.post(
  '/request-password-reset',
  joiValidators.inputValidator(joiValidators.requestPasswordResetSchema),
  userAuthController.requestPasswordReset
);
router.post(
  '/reset-password',
  joiValidators.inputValidator(joiValidators.resetPasswordSchema),
  userAuthController.resetPassword
);

router.post('/logout', userAuthController.userLogout)

export default router;