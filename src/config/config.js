import dotenv from "dotenv";

dotenv.config();

export const serverPort = process.env.PORT || 8000;
export const databaseUri = process.env.MONGODB_URI;

export const cloudeName = process.env.CLOUDINARY_CLOUD_NAME;
export const cloudinaryApiKey = process.env.CLOUDINARY_API_KEY;
export const cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET;