import mongoose from "mongoose";

const languageSchema = new mongoose.Schema(
  {
    code: { type: String, default: "" },
    input: { type: String, default: "" },
    output: { type: String, default: "" },
  },
  { _id: false }
);

const roomSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    language: { type: String, default: "javascript" },
    code: { type: String, default: "" },
    input: { type: String, default: "" },
    output: { type: String, default: "" },
    // Store multiple languages with their own code/input/output
    languages: {
      javascript: { type: languageSchema, default: () => ({}) },
      python: { type: languageSchema, default: () => ({}) },
      cpp: { type: languageSchema, default: () => ({}) },
      java: { type: languageSchema, default: () => ({}) },
      // add more as needed
    },
    participants: [
      {
        userId: { type: String, required: true },
        username: { type: String, required: true },
        role: { type: String, enum: ["host", "guest"], default: "guest" },
        permissions: {
          read: { type: Boolean, default: true },
          write: { type: Boolean, default: false },
        },
        joinedAt: { type: Date, default: Date.now },
      },
    ],
    creatorId: { type: String, required: true },
    savedBy: [{ type: String }], // Array of userIds who saved this room
  },
  {
    timestamps: true,
  }
);

const Room = mongoose.model("Room", roomSchema);

export default Room;
