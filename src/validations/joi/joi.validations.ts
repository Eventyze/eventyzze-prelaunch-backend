import Joi from 'joi';
import {Request, Response, NextFunction} from 'express';

const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W]{8,}$/


const inputValidator = (schema: Joi.Schema):any => {
    return async (request: Request, response: Response, next: NextFunction):Promise<any> => {
      try {
        console.log('bod',request.body.body)
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
  otp: Joi.string().required().messages({
    'string.email': 'OTP is required',
  }).min(5)
})

const loginUserSchemaViaEmail = Joi.object({
    email: Joi.string().trim().required().email().messages({
      'string.email': 'Email is required',
    }),
    password: Joi.string().trim().required().messages({
      'string.base': 'password is required',
    }),
    deviceId: Joi.string().required()
})

const googleAuthSchema = Joi.object({
  token: Joi.string().required(),
});

const facebookAuthSchema = Joi.object({
  accessToken: Joi.string().required(),
});

const requestPasswordResetSchema = Joi.object({
  email: Joi.string().trim().email().required().messages({
    'string.email': 'Email is required',
  }),
});

const resetPasswordSchema = Joi.object({
  email: Joi.string().trim().email().required().messages({
    'string.email': 'Email is required',
  }),
  otp: Joi.string().required().min(5),
  newPassword: Joi.string().trim().min(8).pattern(PASSWORD_PATTERN).required().messages({
    'string.pattern.base': 'Password must contain at least 8 characters comprising of at least one uppercase letter, one lowercase letter, one number and no spaces.'
  }),
});


const firstTimeProfileUpdateSchema = Joi.object({
  userName: Joi.string().trim().required().messages({
    'string.base': 'userName is required'
  }),
  bio: Joi.string().trim().required().messages({
    'string.base': 'bio is required'
  }),
  interests: Joi.array().required().messages({
    'string.base': 'interests are required'
  }),
  phone: Joi.string().trim().required().messages({
    'string.base': 'phone is required'
  }),
  fullName: Joi.string().trim().required().messages({
    'string.base': "fullName is required"
  }),
  state: Joi.string().trim().required().messages({
    'string.base': 'state is required'
  }),
  country: Joi.string().trim().required().messages({
    'string.base': 'country is required'
  }),
  address: Joi.string().trim().required().messages({
    'string.base': 'address is required'
  }),
  stateCode: Joi.string().trim().required().messages({
    'string.base': 'state is required'
  }),
  countryCode: Joi.string().trim().required().messages({
  'string.base': 'country is required'
}),
  deviceId: Joi.string().trim().optional()
});


const createEventSchema = Joi.object({
  eventTitle: Joi.string().trim().required().messages({
    'string.base': 'Event title is required'
  }),
  description: Joi.string().trim().required().messages({
    'string.base': 'Event description is required'
  }),
  startDate: Joi.string().trim().required().messages({
    'string.base': 'Event start date is required'
  }),
  eventTime: Joi.string().trim().required().messages({
    'string.base': 'Event start time is required'
  }),
  duration: Joi.string().trim().required(),
  endTime: Joi.string().trim().required().messages({
    'string.base': 'Event end time is required'
  }),
  cost: Joi.string().trim().required().messages({
    'string.base': 'Event ticket cost is required'
  }),
  coverImage: Joi.string().trim().required().messages({
    'string.base': 'Event cover image/banner is required'
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
  createEventSchema,
  firstTimeProfileUpdateSchema
}