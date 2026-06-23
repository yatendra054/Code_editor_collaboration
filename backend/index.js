import dns from "node:dns/promises";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorMiddleWare from "./middleware/error.js";
import { connectDb } from "./config/dbConnect.js";
import session from "express-session";
import passport from "passport";

import logger from "./utils/logger.js";

import socketHandler from "./socket/socketHandler.js";

// Routes Import
import userRoute from "./routes/userRoutes.js";
import roomRoute from "./routes/roomRoutes.js";

console.log("this is the url", await dns.getServers());
dns.setServers(["1.1.1.1"]);
console.log("this is the url", await dns.getServers());

// Load environment variables
dotenv.config();

const isProduction = process.env.NODE_ENV === "production";
const normalizeOrigin = (value) => value?.replace(/\/$/, "");
const allowedOrigins = [
  normalizeOrigin(process.env.CLIENT_URL),
  "https://codeeditorweb.vercel.app/",

  // "http://localhost:5173",
  // "http://localhost:3000",
].filter(Boolean);

const app = express();
const server = http.createServer(app);

// Trust proxy is required for secure cookies on Render
app.set("trust proxy", 1);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      if (!isProduction) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked origin: ${origin}`), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token"],
  })
);
// JSON body parser
app.use(
  express.json({
    limit: "100mb",
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);
app.use(cookieParser());

// Session & Passport setup
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date(),
    environment: process.env.NODE_ENV,
  });
});

// API routes
app.use("/api", userRoute);
app.use("/api/room", roomRoute);

// Socket.io setup
const io = new Server(server, {
  cors: {
    //    origin: allowedOrigins,
    origin: true,
    credentials: true,
    methods: ["GET", "POST"],
  },
});
socketHandler(io);

// Error Middleware (should be last in middleware chain)
app.use(errorMiddleWare);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  logger.error(err);
  console.log("Shutting down server due to unhandledRejection");
  server.close(() => process.exit(1));
});

const startServer = async () => {
  await connectDb();

  const PORT = process.env.PORT || 5000;
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  logger.error(error);
  process.exit(1);
});
