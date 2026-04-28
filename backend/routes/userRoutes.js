import express from "express";
import {
  getMyProfile,
  loginUser,
  logOutUser,
  registerUser,
  ChangePassword,
  forgotPassword,
  resetPassword,
  updateUserInSetup,
} from "../controllers/userController.js";
import { isAuthenticated } from "../middleware/auth.js";
import {
  loginUserSchema,
  registerUserSchema,
} from "../middleware/validator/userValidator.js";
import validateRequest from "../middleware/validateRequest.js";
import { uploadSingle } from "../middleware/upload.js";

const router = express.Router();

router.post("/register", validateRequest(registerUserSchema), registerUser);
router.post("/login", validateRequest(loginUserSchema), loginUser);
router.get("/logout", logOutUser);

router.get("/me", isAuthenticated, getMyProfile);

router.put(
  "/updateUserInSetup",
  isAuthenticated,
  uploadSingle("profilePhoto"), // <-- multer parses multipart/form-data here
  // validateRequest(updateUserSchema), // <-- if you want to validate server-side, keep it AFTER multer
  updateUserInSetup
);

// Change password from the settings
router.put("/change-password", isAuthenticated, ChangePassword);

router.post("/forgot-password", forgotPassword);
router.put("/reset-password", resetPassword);

export default router;

