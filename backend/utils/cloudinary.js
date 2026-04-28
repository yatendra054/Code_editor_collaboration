import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// ✅ Proper Cloudinary Config
console.log("Cloudinary Config:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? "set" : "missing",
  api_key: process.env.CLOUDINARY_API_KEY ? "set" : " missing",
  api_secret: process.env.CLOUDINARY_API_SECRET ? "set" : "missing",  })
  
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ File Upload Utility
export const uploadFile = async (file, folder, unique = false) => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
      folder,
      use_filename: unique,      // keep original filename if unique=true
      unique_filename: !unique,  // generate random filename if unique=false
      overwrite: unique,
    });

    return {
      public_id: result.public_id,
      url: result.secure_url,   // ✅ use secure_url instead of url (https safe)
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error.message);
    throw new Error("File upload failed");
  }
};

// ✅ File Delete Utility
export const deleteFile = async (public_id) => {
  try {
    const res = await cloudinary.uploader.destroy(public_id);
    return res?.result === "ok";
  } catch (error) {
    console.error("Cloudinary delete error:", error.message);
    return false;
  }
};

export { cloudinary };
