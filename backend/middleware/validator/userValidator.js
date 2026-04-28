import { z } from "zod";

// Register User Schema
export const registerUserSchema = z.object({
  username: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9-_@.]+$/, {
      message:
        "Only alphabets, numbers, hyphen, underscore, at (@), and dot are allowed",
    })
    .min(3)
    .max(30)
    .refine((val) => val.replace(/\s/g, "") === val, {
      message: "Spaces are not allowed",
    }),
  email: z.string().trim().email(),
  password: z
    .string()
    .trim()
    .min(8)
    .max(64)
    .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/, {
      message:
        "Password must contain at least one uppercase letter, one digit, and one special character",
    }),
});

// Login User Schema
export const loginUserSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().trim(),
});

// Update User Profile Schema
export const updateUserSchema = z.object({
  firstName: z
    .string()
    .trim()
    .regex(/^[a-zA-Z]+$/, { message: "Only alphabets are allowed" })
    .min(2)
    .max(50)
    .optional(),

  lastName: z
    .string()
    .trim()
    .regex(/^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/, {
      message: "Only alphabets and single spaces between words are allowed",
    })
    .min(2)
    .max(50)
    .optional(),

  username: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9-_@.]+$/, {
      message:
        "Only alphabets, numbers, hyphen, underscore, at (@), and dot are allowed",
    })
    .min(3)
    .max(30)
    .refine((val) => val.replace(/\s/g, "") === val, {
      message: "Spaces are not allowed",
    })
    .optional(),

  email: z.string().email().optional(),

  phoneNumber: z
    .union([
      z.string().regex(/^\d{10}$/, { message: "Must be 10 digits" }),
      z.number(),
    ])
    .optional(),

  dob: z
    .preprocess(
      (val) => {
        if (typeof val === "string" || val instanceof Date)
          return new Date(val);
      },
      z.date({
        required_error: "DOB is required",
        invalid_type_error: "Invalid date",
      })
    )
    .optional(),

  gender: z.enum(["male", "female", "Male", "Female"]).optional(),

  occupation: z
    .string()
    .trim()
    .regex(/^[a-zA-Z ]+$/, { message: "Only alphabets and spaces are allowed" })
    .optional(),

  bio: z.string().trim().max(250).optional(),
  title: z.string().trim().max(100).optional(),

  profilePhoto: z.string().optional(),
  coverImage: z.string().optional(),

  location: z
    .object({
      address: z.string().trim().max(100).optional(),
      city: z.string().trim().max(50).optional(),
      country: z.string().trim().max(50).optional(),
    })
    .optional(),

  webLinks: z
    .array(
      z.object({
        platform: z.string().min(1, "Platform is required"),
        url: z.string().url("Invalid URL"),
      })
    )
    .optional(),

  accountStatus: z.enum(["active", "suspended", "deleted"]).optional(),
});

// Follow/Unfollow Schema (User ID validation)
export const userIdSchema = z.object({
  _id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID"),
});
