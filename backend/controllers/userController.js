import catchAsyncError from "../middleware/catchAsyncError.js";
import User from "../models/userModel.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";
import sendJWTToken from "../utils/sendJWTToken.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { getResetPasswordTemplate } from "../utils/emailTemplate.js";
import { cloudinary, uploadFile, deleteFile } from "../utils/cloudinary.js";

// Register user -> "/api/register"
export const registerUser = catchAsyncError(async (req, res) => {
  const { email, password, username } = req.body;
  const user = await User.create({
    username,
    email,
    password,
  });

  const token = await user.getJWTToken();

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      token,
    },
  });
});

// Login user -> "/api/login"
export const loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  // Validating password
  const isPasswordMatched = await user.verifyPassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  // Validating user account status
  if (user.accountStatus === "deleted") {
    return next(
      new ErrorHandler(
        "Your account has been deleted. Please contact support.",
        403
      )
    );
  }

  sendJWTToken(user, 200, res);
});

// Logout user -> "/api/logout"
export const logOutUser = catchAsyncError(async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.cookie("setUpPersonalDetails", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "You have been logged out successfully",
    data: null,
  });
});

// Get user profile-> "/api/me"
export const getMyProfile = catchAsyncError(async (req, res) => {
  const user = await User.findById(req?.user?.id);

  return res.status(200).json({
    success: true,
    message: "User profile fetched successfully",
    data: {
      user,
    },
  });
});

// forgot password -> "/api/password/forgot"
export const forgotPassword = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new ErrorHandler("Please provide your email address", 400));
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return next(
      new ErrorHandler("No user found with that email address.", 404)
    );
  }

  const resetTokenRaw = crypto.randomBytes(32).toString("hex");
  const resetTokenHashed = crypto
    .createHash("sha256")
    .update(resetTokenRaw)
    .digest("hex");
  const expires = Date.now() + 15 * 60 * 1000;

  user.resetPasswordToken = resetTokenHashed;
  user.resetPasswordExpire = expires;
  await user.save({ validateBeforeSave: false });

  const resetURL = `${process.env.CLIENT_URL}/reset-password?token=${resetTokenRaw}`;
  const { subject, text, html } = getResetPasswordTemplate(
    user.firstName,
    resetURL
  );

  await sendEmail({
    to: user.email,
    subject,
    text,
    html,
  });

  return res.status(200).json({
    success: true,
    message: "Reset link has been sent to your registered email address.",
    data: null,
  });
});

export const resetPassword = catchAsyncError(async (req, res, next) => {
  const { token, password, confirmPassword } = req.body;
  if (!token || !password || !confirmPassword) {
    return next(new ErrorHandler("All fields are required", 400));
  }
  if (password !== confirmPassword) {
    return next(new ErrorHandler("Passwords do not match", 400));
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ErrorHandler("Token is invalid or has expired", 400));
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  return res.status(200).json({
    success: true,
    message: "Password has been successfully updated.",
    data: null,
  });
});

// controllers/userController.js (relevant extract)
export const updateUserInSetup = catchAsyncError(async (req, res) => {
  const user = await User.findById(req.user?.id).select("+password");
  const data = {};

  // If location was stringified: parse it
  let incomingLocation = req.body?.location;
  if (typeof incomingLocation === "string") {
    try {
      incomingLocation = JSON.parse(incomingLocation);
    } catch (err) {
      console.error("Error parsing location:", err);
      incomingLocation = undefined;
    }
  }

  if (req.body?.firstName) data.firstName = req.body.firstName.trim();
  if (req.body?.lastName) data.lastName = req.body.lastName.trim();
  if (req.body?.gender) data.gender = req.body.gender;
  if (req.body?.bio) data.bio = req.body.bio;

  if (incomingLocation || req.body?.location) {
    const loc = incomingLocation ?? req.body.location;
    data.location = {};
    if (loc?.city) data.location.city = loc.city;
    else data.location.city = user?.location?.city;

    if (loc?.country) data.location.country = loc.country;
    else data.location.country = user?.location?.country;

    if (Object.prototype.hasOwnProperty.call(loc ?? {}, "address")) {
      data.location.address = (loc.address || "").trim();
    }

    if (Object.keys(data.location).length === 0) delete data.location;
  }

  if (req?.body?.dob) data.dob = req.body.dob;
  if (req?.body?.phoneNumber) data.phoneNumber = req.body.phoneNumber;

  if (req.body?.avatar) {
    data.profilePhoto = { url: req.body.avatar, public_id: null };
  }

  Object.assign(user, data);
  if (user?.setUpPersonalDetails === false) user.setUpPersonalDetails = true;

  await user.save();

  res
    .status(201)
    .json({ success: true, message: "User updated successfully", user });
});

// Change Password (used in settings change password)
export const ChangePassword = catchAsyncError(async (req, res, next) => {
  const { currentPassword, newPassword, confirmPassword, userId } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return next(
      new ErrorHandler(
        "All fields (current, new, confirm password) are required.",
        400
      )
    );
  }

  if (newPassword !== confirmPassword) {
    return next(
      new ErrorHandler("New password and confirm password do not match.", 400)
    );
  }

  if (currentPassword === newPassword) {
    return next(
      new ErrorHandler(
        "New password must be different from the current password",
        400
      )
    );
  }

  const user = await User.findById(userId).select("+password");

  const isPasswordMatched = await user.verifyPassword(currentPassword);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Current password is incorrect", 401));
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password changed successfully",
    data: null,
  });
});
