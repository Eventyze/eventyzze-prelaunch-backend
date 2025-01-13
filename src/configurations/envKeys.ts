import dotenv from 'dotenv';

dotenv.config()

// GENERAL SECRETS
export const APP_SECRET = process.env.APP_SECRET!
export const USERS_APP_BASE_URL = process.env.USERS_APP_BASE_URL!

//SMTP SECRETS
export const GMAIL_USER = process.env.GMAIL_USER!
export const GMAIL_PASSWORD = process.env.GMAIL_PASSWORD!

//CLOUDINARY SECRETS
export const CLOUDINARY_NAME = process.env.CLOUDINARY_NAME!
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY!
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET!

//GOOGLE SECRETS
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!

//FACEBOOK SECRETS
export const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID!
export const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET!