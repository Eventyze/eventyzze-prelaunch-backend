import { createClient } from 'redis';

const redisClient = createClient();
redisClient.connect();

export const rateLimitOTP = async (userId: string) => {
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
