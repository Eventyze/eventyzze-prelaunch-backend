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

//DYTE
export const DYTE_BASE_URL = process.env.DYTE_BASE_URL!
export const DYTE_ORGANIZATION_ID = process.env.DYTE_ORGANIZATION_ID!
export const DYTE_API_KEY = process.env.DYTE_API_KEY!


//AGORA
export const AGORA_PRIMARY_CERTIFICATE_KEY = process.env.AGORA_PRIMARY_CERTIFICATE_KEY!
export const AGORA_APP_ID = process.env.AGORA_APP_ID!
export const AGORA_KEY = process.env.AGORA_KEY!
export const AGORA_SECRET = process.env.AGORA_SECRET!


//FLUTTERWAVE
export const FLUTTERWAVE_TEST_PUBLIC_KEY = process.env.FLUTTERWAVE_TEST_PUBLIC_KEY!
export const FLUTTERWAVE_TEST_SECRET_KEY = process.env.FLUTTERWAVE_TEST_SECRET_KEY!
export const FLUTTERWAVE_TEST_ENCRYPTION_KEY = process.env.FLUTTERWAVE_TEST_ENCRYPTION_KEY!
export const FLUTTERWAVE_CALLBACK_URL = process.env.FLUTTERWAVE_CALLBACK_URL!