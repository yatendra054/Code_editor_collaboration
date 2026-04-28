import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
    {

        firstName: {
            type: String,
            required: false,
            default: "",
        },
        lastName: {
            type: String,
            required: false,
            default: "",
        },
        username: {
            type: String,
            unique: true,
            required: [true, "Username already exists!"],
        },
        email: {
            type: String,
            required: [true, "Please enter your email address"],
            unique: true,
        },
        password: {
            type: String,
            select: false,
            required: [true, "Please enter your password"],
        },
        profilePhoto: {
            public_id: {
                type: String,
                required: false,
            },
            url: {
                type: String,
                required: false,
            },
        },
        location: {
            city: {
                type: String,
                required: false,
            },
            country: {
                type: String,
                required: false,
            },
        },
        dob: {
            type: String,
            default: null
        },
        rooms: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Room'
        }],
        resetPasswordToken: String,
        resetPasswordExpire: Date,
        setUpPersonalDetails: {
            type: Boolean,
            default: false,
        },
        phoneNumber: {
            type: Number,
            default: null,
        },
        dob: {
            type: String,
            default: null,
        },
        gender: {
            type: String,
        },
        accountStatus: {
            type: String,
            enum: ["active", "suspended", "deleted"],
            default: "active",
        },
        bio: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

// Encrypting password before saving user in database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = bcrypt.hashSync(this.password, 10);
});

// Generating JWT
userSchema.methods.getJWTToken = async function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRY_TIME,
  });
};

// Validating password
userSchema.methods.verifyPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate reset password token
userSchema.methods.getResetPasswordToken = async function () {
  const token = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;

  return token;
};

export default mongoose.model("User", userSchema);
