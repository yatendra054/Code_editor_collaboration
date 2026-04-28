import mongoose from "mongoose";
import logger from "../utils/logger.js";

export const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    logger.error(error);
  }
};
