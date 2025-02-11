"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const otp_generator_1 = __importDefault(require("otp-generator"));
const envKeys_1 = require("../../configurations/envKeys");
const repositories_1 = require("../../repositories");
const uuid_1 = require("uuid");
const dayjs_1 = __importDefault(require("dayjs"));
// import { ResponseDetails } from '../../types/utilities.types';
// import { errorUtilities } from '../../utilities';
// import { QueryParameters } from '../../types/helpers.types';
/**
 * Hash Password:
 * This function hashes a given password using bcrypt with a salt factor of 5.
 * @param {string} password - The password to be hashed.
 * @returns {Promise<string>} - The hashed password.
 * @throws {Error} - Throws an error if there is an issue with hashing the password.
 */
const hashPassword = async (password) => {
    const salt = await bcryptjs_1.default.genSalt(5);
    const passwordHash = await bcryptjs_1.default.hash(password, salt);
    return passwordHash;
};
/**
 * Validate Password:
 * This function compares a given password with a hashed user password using bcrypt.
 * @param {string} password - The password to be validated.
 * @param {string} userPassword - The hashed user password to compare against.
 * @returns {Promise<boolean>} - Returns true if the password matches, otherwise false.
 * @throws {Error} - Throws an error if there is an issue with validating the password.
 */
const validatePassword = async (password, userPassword) => {
    return await bcryptjs_1.default.compare(password, userPassword);
};
/**
 * Generate Token:
 * This function generates a JSON Web Token (JWT) with a given payload and an expiration time of 15 hours.
 * @param {Record<string, string>} payload - The payload to be included in the token.
 * @returns {Promise<string>} - The generated token.
 * @throws {Error} - Throws an error if there is an issue with generating the token.
 */
const generateTokens = async (payload, expiresIn) => {
    return jsonwebtoken_1.default.sign(payload, `${envKeys_1.APP_SECRET}`, { expiresIn: expiresIn });
};
/**
 * Verify Token:
 * This function verifies a given JSON Web Token (JWT) using the application secret.
 * @param {string} token - The token to be verified.
 * @returns {Promise<object>} - The decoded token payload if verification is successful.
 * @throws {Error} - Throws an error if there is an issue with verifying the token.
 */
// const verifyRegistrationToken = async (token: string): Promise<any> => {
//   try {
//     return jwt.verify(token, `${APP_SECRET}`);
//   } catch (error: any) {
//     if (error.message === 'jwt expired') {
//       throw errorUtilities.createError('Please request a new verification email', 401);
//     }
//     throw errorUtilities.createUnknownError(error);
//   }
// };
const dateFormatter = (dateString) => {
    const year = dateString.getFullYear();
    const month = dateString.getMonth() + 1;
    const day = dateString.getDate();
    const hours = dateString.getHours();
    const minutes = dateString.getMinutes();
    const seconds = dateString.getSeconds();
    const date = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    return {
        date,
        time
    };
};
// const refreshUserToken = async (
//     userRefreshToken: string
//   ) => {
//     try{
//         let responseDetails: ResponseDetails = {
//             statusCode: 0,
//             message: '',
//         };
//     const decodedToken:any = jwt.verify(userRefreshToken, `${APP_SECRET}`);
//     if (!decodedToken) {
//         responseDetails.statusCode = 401;
//         responseDetails.message = 'Invalid Refresh Token';
//         return responseDetails;
//       }
//       const userPayload = {
//         id: decodedToken.id,
//         email: decodedToken.email,
//       }
//       const newAccessToken = await generateTokens(userPayload, '3h')
//       const newRefreshToken = await generateTokens(userPayload, '30d')
//       responseDetails.statusCode = 200;
//       responseDetails.message = 'Refresh Token is valid, new tokens generated';
//       responseDetails.data = {
//         accessToken: newAccessToken,
//         refreshToken: newRefreshToken,
//     }
//     return responseDetails;
//     }catch (error: any) {
//         if (error.message === 'jwt expired') {
//           let responseDetails: ResponseDetails = {
//             statusCode: 0,
//             message: '',
//           };
//           responseDetails.statusCode = 403;
//           responseDetails.message = 'Please login again';
//           return responseDetails;
//         }
//       }
//   };
const generateOtp = async () => {
    const otp = otp_generator_1.default.generate(5, { upperCaseAlphabets: false, specialChars: false, digits: true, lowerCaseAlphabets: false });
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    const otpReturn = ({ otp, expiresAt });
    return otpReturn;
};
const verifyOtp = async (otp) => {
    if (new Date(otp.expiresAt) < new Date())
        return false;
    return true;
};
/**
* Generates a unique transaction reference.
* @returns {string} A unique transaction reference.
*/
const generateTransactionReference = (eventName) => {
    const eventInitials = eventName.split(" ").map((word) => word[0].match(/[a-z,A-Z]/) ? word[0]?.toUpperCase() : word[0]).join("");
    return `EVENTYZZE-TXN-${eventInitials}-${Date.now()}`;
};
const generateUniqueUserEventyzzeId = async (countryCode, stateCode, maxRetries = 5) => {
    let attempt = 0;
    while (attempt < maxRetries) {
        try {
            const eventyzzeId = `EVNTZ-${countryCode}-${stateCode}-${(0, uuid_1.v1)().substring(0, 6).toUpperCase()}`;
            const existingUser = await repositories_1.userRepositories.userRepositories.getOne({ eventyzzeId }, ['eventyzzeId']);
            if (!existingUser) {
                return eventyzzeId;
            }
            attempt++;
        }
        catch (error) {
            attempt++;
        }
    }
    throw new Error('Failed to generate unique EventyzzeId after maximum retries');
};
//FOR THE FUTURE
// const generateUniqueUserEventyzzeId = async (
//   countryCode: string,
//   stateCode: string
// ): Promise<string> => {
//   // Get current timestamp in milliseconds
//   const timestamp = Date.now().toString(36);
//   // Get UUID v1 which includes timestamp + node identifier
//   const uniqueSegment = uuidv1().substring(0, 6);
//   // Combine with a random number for extra uniqueness
//   const randomNum = Math.floor(Math.random() * 1000).toString(36);
//   return `EVNTZ-${countryCode}-${stateCode}-${timestamp}${uniqueSegment}${randomNum}`;
// };
//This function is used to manage queries (request.query) for the application  
// export const queryFilter = async (queryItem: QueryParameters) => {
//   const query: FilterQuery<any> = {};
//   if (queryItem?.shopName) {
//     query["shopName"] = queryItem.shopName.toLowerCase();
//   }
//   if (queryItem?.shopCategory) {
//     query["shopCategory"] = queryItem.shopCategory;
//   }
//   if (queryItem?.productName) {
//     query["productName"] = queryItem.productName;
//   }
//   if (queryItem?.productCategory) {
//     query["productCategory"] = queryItem.productCategory;
//   }
//   if (queryItem?.min_cost && queryItem?.max_cost) {
//     query.cost = {
//       $gte: queryItem.min_cost,
//       $lte: queryItem.max_cost
//     };
//   } else if (queryItem?.min_cost) {
//     query.cost = {
//       $gte: queryItem.min_cost
//     };
//   } else if (queryItem?.max_cost) {
//     query.cost = {
//       $lte: queryItem.max_cost
//     };
//   } else if (queryItem?.exact_cost) {
//     query.cost = queryItem.exact_cost;
//   }
//   if (queryItem?.start_date && queryItem?.end_date) {
//     query.createdAt = {
//       $gte: new Date(queryItem.start_date),
//       $lte: new Date(queryItem.end_date)
//     };
//   } else if (queryItem?.start_date) {
//     query.createdAt = {
//       $gte: new Date(queryItem.start_date)
//     };
//   } else if (queryItem?.end_date) {
//     query.createdAt = {
//       $lte: new Date(queryItem.end_date)
//     };
//   }
//   return query;
// };
// Function to calculate endTime
const calculateEndTime = (startTime, duration, startDate) => {
    const start = (0, dayjs_1.default)(`${startDate}T${startTime}`);
    const end = start.add(duration, "minute");
    return end.format("HH:mm");
};
exports.default = {
    hashPassword,
    validatePassword,
    generateOtp,
    generateTokens,
    verifyOtp,
    // refreshUserToken,
    dateFormatter,
    // verifyRegistrationToken
    generateTransactionReference,
    generateUniqueUserEventyzzeId,
    calculateEndTime
};
