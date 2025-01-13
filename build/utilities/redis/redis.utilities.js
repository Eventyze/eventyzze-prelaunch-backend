"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimitOTP = void 0;
const redis_1 = require("redis");
const redisClient = (0, redis_1.createClient)();
redisClient.connect();
const rateLimitOTP = async (userId) => {
    const key = `otp_requests:${userId}`;
    const ttl = 60 * 5;
    const requestCount = await redisClient.incr(key);
    if (requestCount === 1) {
        await redisClient.expire(key, ttl);
    }
    if (requestCount > 3) {
        throw new Error('Too many OTP requests. Please try again later.');
    }
};
exports.rateLimitOTP = rateLimitOTP;
