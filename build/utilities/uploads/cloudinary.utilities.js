"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary_1 = require("cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
const envKeys_1 = require("../../configurations/envKeys");
const logger_utilities_1 = require("../logger/logger.utilities");
dotenv_1.default.config();
cloudinary_1.v2.config({
    cloud_name: envKeys_1.CLOUDINARY_NAME,
    api_key: envKeys_1.CLOUDINARY_API_KEY,
    api_secret: envKeys_1.CLOUDINARY_API_SECRET
});
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: async (req, file) => {
        try {
            if (!file)
                throw new Error("File is required");
            return {
                folder: "Eventyzze"
            };
        }
        catch (error) {
            logger_utilities_1.logger.error(`Cloudinary storage error: ${error.message}`);
            throw error;
        }
    }
});
const cloud = (0, multer_1.default)({
    storage: storage,
    fileFilter: (req, file, cb) => {
        try {
            if (file.mimetype == "image/png" ||
                file.mimetype == "image/jpg" ||
                file.mimetype == "image/jpeg" ||
                file.mimetype == "image/webp" ||
                file.mimetype == "image/avif") {
                cb(null, true);
            }
            else {
                logger_utilities_1.logger.error(`Invalid file type: ${file.mimetype}`);
                cb(null, false);
                return cb(new Error("Only .png, .jpg, .jpeg, .webp, .avif formats are allowed"));
            }
        }
        catch (error) {
            logger_utilities_1.logger.error(`File filter error: ${error.message}`);
            cb(error);
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
}).single('image');
// Create a wrapper function to handle upload errors
const upload = (req, res, next) => {
    cloud(req, res, (error) => {
        if (error instanceof multer_1.default.MulterError) {
            // A Multer error occurred when uploading
            logger_utilities_1.logger.error(`Multer error: ${error.message}`);
            return res.status(400).json({
                status: 'error',
                message: error.message
            });
        }
        else if (error) {
            // An unknown error occurred when uploading
            logger_utilities_1.logger.error(`Upload error: ${error.message}`);
            return res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
        // Everything went fine
        next();
    });
};
exports.default = upload;
