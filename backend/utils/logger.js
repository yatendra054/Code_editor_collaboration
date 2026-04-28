// logger.js
import * as Sentry from "@sentry/node";
import { createLogger, format, transports } from "winston";

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: [
    new transports.Console({ level: "debug" }), // Always see logs in console (dev)
    new transports.File({ filename: "logs/error.log", level: "error" }),
    new transports.File({ filename: "logs/combined.log" }),
  ],
});

logger.error = (err, meta = {}) => {
  // Always log error in Winston
  logger.log({
    level: "error",
    message: err.message || "Unknown error",
    stack: err.stack,
    statusCode: err.statusCode,
    ...meta,
  });

  // Only send to Sentry if in production AND it's a server error (>=500)
  if (process.env.NODE_ENV === "production") {
    if (err.statusCode && err.statusCode >= 500) {
      Sentry.captureException(err, {
        extra: {
          route: meta?.originalUrl,
          method: meta?.method,
          body: meta?.body,
        },
      });
    }
  }
};

export default logger;
