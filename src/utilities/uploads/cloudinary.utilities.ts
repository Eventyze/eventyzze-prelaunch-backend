import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import { Request, Response } from 'express';
import { CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } from '../../configurations/envKeys';
import { errorUtilities } from '../';

dotenv.config()

cloudinary.config({
    cloud_name: CLOUDINARY_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async(req, file) => {
        try {
            if (!file) throw new Error("File is required");
            return {
                folder: "Eventyzze"
            }
        } catch (error: any) {
            console.error(`Cloudinary storage error: ${error.message}`);
            throw error;
        }
    }
})

const cloud = multer({
    storage: storage,
    fileFilter: (req: Request, file, cb) => {
        try {
            if(
                file.mimetype == "image/png" ||
                file.mimetype == "image/jpg" ||
                file.mimetype == "image/jpeg" ||
                file.mimetype == "image/webp" ||
                file.mimetype == "image/avif"
            ){
                cb(null, true);
            } else {
                console.error(`Invalid file type: ${file.mimetype}`);
                cb(null, false);
                return cb(new Error("Only .png, .jpg, .jpeg, .webp, .avif formats are allowed"));
            }
        } catch (error: any) {
            console.error(`File filter error: ${error.message}`);
            cb(error);
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
}).single('image');

// Create a wrapper function to handle upload errors
const upload = (req: Request, res: Response, next: Function) => {
    cloud(req, res, (error: any) => {
        if (error instanceof multer.MulterError) {
            // A Multer error occurred when uploading
            console.error(`Multer error: ${error.message}`);
            return res.status(400).json({
                status: 'error',
                message: error.message
            });
        } else if (error) {
            // An unknown error occurred when uploading
            console.error(`Upload error: ${error.message}`);
            return res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
        // Everything went fine
        next();
    });
};

export default upload;