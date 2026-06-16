import mongoose from "mongoose";
import logger from "../utils/logger.js";

export const connectDb = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured in the backend environment.");
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    logger.error(error);
    throw error;
  }
};
