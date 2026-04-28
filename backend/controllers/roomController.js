// controllers/roomController.js

import Room from "../models/roomModel.js";

// ✅ Create a new room
export const createRoom = async (req, res) => {
  try {
    const { roomId, language, code, input, output, participants } = req.body;

    const room = await Room.create({
      roomId,
      language,
      code,
      input,
      output,
      participants,
    });

    res.status(201).json({ success: true, room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get a room by roomId
export const getRoomById = async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findOne({ roomId }).populate("participants.userId", "username email");

    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }

    res.json({ success: true, room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get all rooms
export const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find().populate("participants.userId", "username email");
    res.json({ success: true, rooms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update code editor (language, code, input, output)
export const updateRoomData = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { language, code, input, output } = req.body;

    const room = await Room.findOneAndUpdate(
      { roomId },
      { language, code, input, output },
      { new: true }
    );

    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }

    res.json({ success: true, room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Add participant to a room
export const addParticipant = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { userId, username } = req.body;

    const room = await Room.findOneAndUpdate(
      { roomId },
      { $push: { participants: { userId, username } } },
      { new: true }
    );

    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }

    res.json({ success: true, room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Remove participant
export const removeParticipant = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { userId } = req.body;

    const room = await Room.findOneAndUpdate(
      { roomId },
      { $pull: { participants: { userId } } },
      { new: true }
    );

    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }

    res.json({ success: true, room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Delete a room
export const deleteRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findOneAndDelete({ roomId });

    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }

    res.json({ success: true, message: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get rooms created by the logged-in user (only if they saved it)
export const getMyCreatedRooms = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const rooms = await Room.find({ 
      creatorId: userId,
      savedBy: { $in: [userId] }
    });
    res.json({ success: true, rooms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get rooms the logged-in user has joined and saved
export const getMyJoinedRooms = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const rooms = await Room.find({ 
      creatorId: { $ne: userId },
      savedBy: { $in: [userId] }
    });
    res.json({ success: true, rooms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Remove a room from user's joined history
export const removeFromHistory = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user._id.toString();

    const room = await Room.findOneAndUpdate(
      { roomId },
      { $pull: { participants: { userId } } },
      { new: true }
    );

    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }

    res.json({ success: true, message: "Removed from history", room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Save room session to history
export const saveRoomSession = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { language, code, input, output } = req.body;
    const userId = req.user._id.toString();

    const room = await Room.findOneAndUpdate(
      { roomId },
      { 
        $set: { language, code, input, output },
        $addToSet: { savedBy: userId } 
      },
      { new: true }
    );

    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }

    res.json({ success: true, message: "Session saved to history", room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
