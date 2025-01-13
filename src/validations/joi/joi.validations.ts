import Joi from 'joi';
import {Request, Response, NextFunction} from 'express';

const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W]{8,}$/


const inputValidator = (schema: Joi.Schema):any => {
    return async (request: Request, response: Response, next: NextFunction):Promise<any> => {
      try {
        const { error } = schema.validate(request.body);
        if (error) {
          return response.status(400).json({
            status: 'error',
            message: `${error.details[0].message.replace(/["\\]/g, '')}`,
          });
        }
        return next();
      } catch (err) {
        return response.status(500).json({
          status: 'error',
          message: 'Internal Server Error',
        });
      }
    };
  };

//User Auth
const userRegisterSchemaViaEmail = Joi.object({
  email: Joi.string().trim().email().required(),
  password: Joi.string().trim().min(8).pattern(PASSWORD_PATTERN).required().messages({
    'string.pattern.base': 'Password must contain at least 8 characters comprising of at least one uppercase letter, one lowercase letter, one number and no spaces.'
  }),
});

const verifyOtpSchema = Joi.object({
  email: Joi.string().required(),
  otp: Joi.string().required().min(5)
})

const loginUserSchemaViaEmail = Joi.object({
    email: Joi.string().trim().required().email(),
    password: Joi.string().trim().required()
})

const googleAuthSchema = Joi.object({
  token: Joi.string().required(),
});

const facebookAuthSchema = Joi.object({
  accessToken: Joi.string().required(),
});

const requestPasswordResetSchema = Joi.object({
  email: Joi.string().trim().email().required(),
});

const resetPasswordSchema = Joi.object({
  email: Joi.string().trim().email().required(),
  otp: Joi.string().required().min(5),
  newPassword: Joi.string().trim().min(8).pattern(PASSWORD_PATTERN).required().messages({
    'string.pattern.base': 'Password must contain at least 8 characters comprising of at least one uppercase letter, one lowercase letter, one number and no spaces.'
  }),
});

export default {
  userRegisterSchemaViaEmail,
  loginUserSchemaViaEmail,
  verifyOtpSchema,
  inputValidator,
  googleAuthSchema,
  facebookAuthSchema,
  requestPasswordResetSchema,
  resetPasswordSchema,
}