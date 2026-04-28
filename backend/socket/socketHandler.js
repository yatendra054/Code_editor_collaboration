import mongoose from "mongoose";
import Room from "../models/roomModel.js";
import { DEFAULT_CODE } from "../utils/constants.js";
import { executeCode } from "../services/codeExecutor.js";
import aiService from "../services/aiService.js";

// In-memory chat storage: roomId -> array of { userName, message, timestamp }
const chatRooms = new Map();
const MAX_CHAT_HISTORY = 50;

// Tracking user socket mapping: userId -> socketId
const userSockets = new Map();
// Pending join requests: requestId -> { roomId, userId, userName, socketId }
const pendingRequests = new Map();

function getChatHistory(roomId) {
  return chatRooms.get(roomId) || [];
}

function addChatMessage(roomId, userName, message) {
  if (!chatRooms.has(roomId)) {
    chatRooms.set(roomId, []);
  }
  const messages = chatRooms.get(roomId);
  const chatMsg = { userName, message, timestamp: new Date().toISOString() };
  messages.push(chatMsg);
  // Keep only the last MAX_CHAT_HISTORY messages
  if (messages.length > MAX_CHAT_HISTORY) {
    messages.shift();
  }
  return chatMsg;
}

function clearChatHistory(roomId) {
  chatRooms.delete(roomId);
}

function canWrite(room, userId) {
  // Creator always has write access
  if (room.creatorId === userId) return true;

  const participant = room.participants.find(p => p.userId === userId);
  // Default to true for read, but we check write here
  return participant?.permissions?.write !== false;
}

export default function socketHandler(io) {
  io.on("connection", (socket) => {
    let currentRoom = null;
    let currentUser = null;

    // Join a room
    socket.on("join", async ({ roomId, userId, userName }) => {
      try {
        // Track the user's current socket
        userSockets.set(userId, socket.id);

        currentRoom = roomId;
        currentUser = userId;

        // Find or create room
        let room = await Room.findOne({ roomId });
        if (!room) {
          // Check if user is authenticated (not a guest)
          // Guest userId matches socket.id and is not a valid MongoDB ObjectId
          const isGuest = !mongoose.Types.ObjectId.isValid(userId);

          if (isGuest) {
            return socket.emit("joinError", { message: "Login required to create a new room" });
          }

          room = new Room({
            roomId,
            language: "javascript",
            code: DEFAULT_CODE.javascript,
            input: "",
            output: "",
            participants: [],
            creatorId: userId, // The first person to join is the creator
          });
          await room.save();
        }

        // Check if creator is logged in (active in the room)
        const isCreator = userId === room.creatorId;
        const isCreatorInRoom = room.participants.some(p => p.userId === room.creatorId);

        // Logic for Join Request
        const hasSavedRoom = room.savedBy?.includes(userId);

        if (!isCreator && !hasSavedRoom) {
          if (!isCreatorInRoom) {
            // Creator is not here, so others cannot join
            return socket.emit("joinError", { message: "this room id not exist" });
          }

          // If creator is here, send a request
          const creatorSocketId = userSockets.get(room.creatorId);
          if (creatorSocketId) {
            const requestId = `${roomId}-${userId}`;

            // Check if request already exists to prevent duplicate notifications
            if (pendingRequests.has(requestId)) {
              return socket.emit("waitingForApproval", { message: "Waiting for creator's approval..." });
            }

            pendingRequests.set(requestId, { roomId, userId, userName, socketId: socket.id });

            // Notify creator
            io.to(creatorSocketId).emit("incomingJoinRequest", {
              requestId,
              userName,
              userId
            });

            // Notify requester
            return socket.emit("waitingForApproval", { message: "Waiting for creator's approval..." });
          } else {
            // Creator found in DB but socket not tracked? This shouldn't happen if they are active.
            return socket.emit("joinError", { message: "this room id not exist" });
          }
        }

        // If we reach here, it's either the creator joining or someone who was approved (handled elsewhere)
        await finalizeJoin(socket, room, userId, userName, roomId);

      } catch (err) {
        console.error("Join Room Error:", err);
      }
    });

    async function finalizeJoin(socket, room, userId, userName, roomId) {
      socket.join(roomId);

      // Add participant if not already
      if (!room.participants.some((p) => p.userId?.toString() === userId)) {
        const role = userId === room.creatorId ? "host" : "guest";
        room.participants.push({
          userId,
          username: userName,
          role,
          permissions: { read: true, write: role === 'host' }
        });
        await room.save();
      }

      // Send initial state to user
      socket.emit("initialState", {
        code: room.code,
        language: room.language,
        input: room.input,
        output: room.output,
        users: room.participants, // Now sends full objects: { userId, username, role, permissions }
      });

      // Send chat history to the joining user
      socket.emit("chatHistory", getChatHistory(roomId));

      // Notify others
      socket.to(roomId).emit(
        "userJoined",
        room.participants
      );
    }

    // Handle Join Request Approval (by Creator)
    socket.on("approveJoinRequest", async ({ requestId, approved }) => {
      const request = pendingRequests.get(requestId);
      if (!request) return;

      const { roomId, userId, userName, socketId } = request;
      const requesterSocket = io.sockets.sockets.get(socketId);

      if (approved && requesterSocket) {
        let room = await Room.findOne({ roomId });
        if (room) {
          await finalizeJoin(requesterSocket, room, userId, userName, roomId);
          requesterSocket.emit("joinResponse", { approved: true });
        }
      } else if (requesterSocket) {
        requesterSocket.emit("joinResponse", { approved: false, message: "Your request to join was declined." });
      }

      pendingRequests.delete(requestId);
    });

    // Handle Permission Updates (by Host)
    socket.on("updatePermissions", async ({ roomId, targetUserId, permissions }) => {
      try {
        const room = await Room.findOne({ roomId });
        if (!room) return;

        // Verify only Host can update permissions
        if (room.creatorId?.toString() !== currentUser?.toString()) {
          console.warn(`Unauthorized permission update attempt by ${currentUser} in room ${roomId}`);
          return;
        }

        const updatedRoom = await Room.findOneAndUpdate(
          { roomId, "participants.userId": targetUserId },
          { $set: { "participants.$.permissions": permissions } },
          { new: true }
        );

        if (updatedRoom) {
          // Notify room about updated permissions
          io.to(roomId).emit("permissionsUpdated", {
            users: updatedRoom.participants
          });
        } else {
          console.error(`Failed to find participant ${targetUserId} in room ${roomId} to update permissions`);
        }
      } catch (err) {
        console.error("Update Permissions Error:", err);
      }
    });

    // Chat message
    socket.on("chatMessage", ({ roomId, userName, message }) => {
      if (!message || !message.trim()) return;
      const chatMsg = addChatMessage(roomId, userName, message.trim());
      io.to(roomId).emit("chatMessageReceived", chatMsg);
    });

    // Code change
    socket.on("codeChange", async ({ roomId, code }) => {
      const room = await Room.findOne({ roomId });
      if (room && !canWrite(room, currentUser)) return;

      await Room.findOneAndUpdate({ roomId }, { $set: { code } });
      socket.to(roomId).emit("codeUpdate", code);
    });

    // Typing indication
    socket.on("typing", async ({ roomId, userName, line }) => {
      const room = await Room.findOne({ roomId });
      if (room && !canWrite(room, currentUser)) return;

      socket.to(roomId).emit("userTyping", { userName, line });
    });

    // Cursor movement for remote cursors
    socket.on("cursorMove", async ({ roomId, userName, cursorPosition }) => {
      const room = await Room.findOne({ roomId });
      if (room && !canWrite(room, currentUser)) return;

      socket.to(roomId).emit("cursorUpdate", { userName, cursorPosition });
    });

    // Input change
    socket.on("inputChange", async ({ roomId, input }) => {
      const room = await Room.findOne({ roomId });
      if (room && !canWrite(room, currentUser)) return;

      await Room.findOneAndUpdate({ roomId }, { $set: { input } });
      socket.to(roomId).emit("inputUpdate", input);
    });

    // Language change
    socket.on("languageChange", async ({ roomId, language }) => {
      const room = await Room.findOne({ roomId });
      if (room && !canWrite(room, currentUser)) return;

      const newCode = DEFAULT_CODE[language] || "";
      await Room.findOneAndUpdate(
        { roomId },
        { $set: { language, code: newCode } }
      );
      io.to(roomId).emit("languageUpdate", language);
      io.to(roomId).emit("codeUpdate", newCode);
    });

    // Compile + execute code
    socket.on("compileCode", async ({ code, roomId, language, version, input }) => {
      try {
        const room = await Room.findOne({ roomId });
        if (room && !canWrite(room, currentUser)) {
          return socket.emit("codeResponse", { run: { output: "Permission Denied: You cannot execute code in this room." } });
        }

        const result = await executeCode(roomId, code, language, version, input);
        await Room.findOneAndUpdate(
          { roomId },
          { $set: { output: result.run.output } }
        );
        io.to(roomId).emit("codeResponse", result);
      } catch (error) {
        io.to(roomId).emit("codeResponse", {
          run: { output: `Execution failed: ${error.message}` },
        });
      }
    });

    // AI Query handler
    socket.on("aiQuery", async ({ prompt, code, language }) => {
      try {
        const response = await aiService.generateResponse(prompt, code, language);
        socket.emit("aiResponse", response);
      } catch (error) {
        console.error("AI Query Socket Error:", error);
        socket.emit("aiResponse", { message: "Failed to reach AI service." });
      }
    });

    // Leave Room
    socket.on("leaveRoom", async () => {
      if (currentRoom && currentUser) {
        const room = await Room.findOne({ roomId: currentRoom });

        if (room) {
          // If the leaving user is the creator, inform others
          if (room.creatorId === currentUser) {
            io.to(currentRoom).emit("roomClosed", { message: "Host has left. Session ended." });
            
            // Delete only if nobody has saved this room
            if (!room.savedBy || room.savedBy.length === 0) {
              await Room.findOneAndDelete({ roomId: currentRoom });
              clearChatHistory(currentRoom);
            } else {
              // Just remove participants who are currently in the room
              await Room.findOneAndUpdate(
                { roomId: currentRoom },
                { $set: { participants: [] } }
              );
            }
          } else {
            // Remove participant
            const updatedRoom = await Room.findOneAndUpdate(
              { roomId: currentRoom },
              { $pull: { participants: { userId: currentUser } } },
              { new: true }
            );

            if (updatedRoom && updatedRoom.participants.length > 0) {
              io.to(currentRoom).emit(
                "userJoined",
                updatedRoom.participants
              );
            }
          }
        }

        socket.leave(currentRoom);
        currentRoom = null;
        currentUser = null;
      }
    });

    // Disconnect
    socket.on("disconnect", async () => {
      if (currentUser) {
        userSockets.delete(currentUser);
      }

      if (currentRoom && currentUser) {
        // IMPORTANT: Logged-in users (who have a valid Mongo ObjectId as currentUser) 
        // should NOT be automatically removed on disconnect to support persistence.
        // Guests (who use their socket.id as currentUser) are still removed automatically.
        const isGuest = !mongoose.Types.ObjectId.isValid(currentUser);

        if (isGuest) {
          const room = await Room.findOne({ roomId: currentRoom });

          if (room) {
            // Check if leaving guest was Host (unlikely but possible)
            const wasHost = room.creatorId === currentUser;

            if (wasHost) {
              io.to(currentRoom).emit("roomClosed", { message: "Host has left. Session ended." });
              
              if (!room.savedBy || room.savedBy.length === 0) {
                await Room.findOneAndDelete({ roomId: currentRoom });
                clearChatHistory(currentRoom);
              } else {
                await Room.findOneAndUpdate(
                  { roomId: currentRoom },
                  { $set: { participants: [] } }
                );
              }
            } else {
              const updatedRoom = await Room.findOneAndUpdate(
                { roomId: currentRoom },
                { $pull: { participants: { userId: currentUser } } },
                { new: true }
              );

              if (updatedRoom && updatedRoom.participants.length > 0) {
                io.to(currentRoom).emit(
                  "userJoined",
                  updatedRoom.participants
                );
              }
            }
          }
        } else {
          console.log(`Persistent user disconnected (socket only): ${currentUser}. No cleanup performed.`);
        }
      }
    });
  });
}
