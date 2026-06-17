// Import Cloudinary v2 SDK
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary connection
cloudinary.config({
  // Your Cloudinary account name
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,

  // Public API key
  api_key: process.env.CLOUDINARY_API_KEY,

  // Private secret key
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Export configured instance
export default cloudinary;
