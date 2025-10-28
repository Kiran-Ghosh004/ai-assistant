import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

const uploadOnCloudinary = async (filePath) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  try {
    const uploadResult = await cloudinary.uploader.upload(filePath);
    fs.unlinkSync(filePath); // delete local file after upload
    return uploadResult.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath); // delete file safely
    throw new Error("Cloudinary upload failed"); // don’t use res inside utility function
  }
};

export default uploadOnCloudinary;
