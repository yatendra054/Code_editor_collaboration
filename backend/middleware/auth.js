import User from "../models/userModel.js";
import dotenv from "dotenv";
import ErrorHandler from "../utils/ErrorHandler.js";
import jwt from "jsonwebtoken";

dotenv.config();

export const isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(
      new ErrorHandler("Please login to access these resources", 401)
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(
        new ErrorHandler("Session expired. Please log in again.", 401)
      );
    }

    if (error.name === "JsonWebTokenError") {
      return next(new ErrorHandler("Invalid token. Please log in again.", 401));
    }

    return next(new ErrorHandler("Authentication failed.", 401));
  }
};
