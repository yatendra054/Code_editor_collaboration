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

const app = express();
const server = http.createServer(app);

// Trust proxy is required for secure cookies on Render
app.set("trust proxy", 1);

// CORS setup
const allowedOrigins = [
  process.env.CLIENT_URL,
  "https://codesync-realtime-editor.vercel.app",
  "http://localhost:5173", // Vite default
  "http://localhost:3000",
].filter(Boolean);


app.use(
  cors({
    origin: function (origin, callback) {
      callback(null, true); // allow all origins
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
      secure: true, // Always true for cross-site (Render <-> Vercel)
      sameSite: "none", // Required for cross-site cookies
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// DB Connection
connectDb();

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

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  logger.error(err);
  console.log("Shutting down server due to unhandledRejection");
  server.close(() => process.exit(1));
});
