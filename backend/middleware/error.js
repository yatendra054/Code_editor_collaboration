import ErrorHandler from "../utils/ErrorHandler.js";
import logger from "../utils/logger.js";

/* eslint-disable no-unused-vars */
export default (err, req, res, next) => {
  /* eslint-enable no-unused-vars */

  let error = {
    statusCode: err?.statusCode || 500,
    message: err?.message || "Internal Server Error",
    errors: [], // optional detailed errors
  };

  // Handle Invalid Mongoose ID Error
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err?.path}`;
    error = new ErrorHandler(message, 404);
  }

  // Handle Duplicate email and username error
  if (err?.code === 11000) {
    let message;
    if (err?.keyPattern.username) {
      message = `Username already exists`;
    } else {
      message = `User with entered email already exists`;
    }
    error = new ErrorHandler(message, 400); // 400 is better for duplicate
  }

  // Handle Validation Error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    error = new ErrorHandler("Validation failed", 400);
    error.errors = messages.map((msg) => ({ message: msg }));
  }

  if (error.statusCode >= 500) {
    // Only log server-caused errors
    logger.error(err, {
      route: req.originalUrl,
      method: req.method,
    });
  } else {
    // For user errors, log as warning
    logger.warn({
      message: error.message,
      route: req.originalUrl,
      method: req.method,
    });
  }

  // Send response
  const responsePayload = {
    success: false,
    message: error.message,
  };

  // Include detailed errors if present
  if (error.errors && error.errors.length > 0) {
    responsePayload.errors = error.errors;
  }

  // Include stacktrace only in development
  if (process.env.NODE_ENV === "development") {
    responsePayload.stack = err?.stack;
    responsePayload.originalError = err;
  }

  return res.status(error.statusCode).json(responsePayload);
};
