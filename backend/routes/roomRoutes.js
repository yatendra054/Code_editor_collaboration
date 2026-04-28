import express from "express";
import {
  createRoom,
  getRoomById,
  getAllRooms,
  updateRoomData,
  addParticipant,
  removeParticipant,
  deleteRoom,
  getMyCreatedRooms,
  getMyJoinedRooms,
  removeFromHistory,
  saveRoomSession,
} from "../controllers/roomController.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.post("/room", isAuthenticated, createRoom);
router.get("/getAllRooms", getAllRooms);
router.get("/:roomId", getRoomById);
router.put("/:roomId", updateRoomData);
router.put("/save/:roomId", isAuthenticated, saveRoomSession);
router.post("/:roomId/participants", addParticipant);
router.delete("/:roomId/participants", removeParticipant);


router.get("/my/created", isAuthenticated, getMyCreatedRooms);
router.get("/my/joined", isAuthenticated, getMyJoinedRooms);
router.delete("/history/:roomId", isAuthenticated, removeFromHistory);

router.delete("/:roomId", isAuthenticated, deleteRoom);

export default router;
