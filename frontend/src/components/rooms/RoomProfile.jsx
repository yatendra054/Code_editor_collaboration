import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Users, Code } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_URL } from "../../utils/constants";

const MAX_ROOMS = 6;


const RoomCard = ({ room, onDelete, onEnter }) => (
  <motion.div
    whileHover={{ scale: 1.05, y: -5 }}
    transition={{ type: "spring", stiffness: 300, damping: 25 }}
    className="cursor-pointer bg-[#1f2937]/80 backdrop-blur-sm border border-gray-700/50 shadow-xl rounded-xl p-5 relative overflow-hidden group"
    onClick={() => onEnter(room)}
  >
    {/* Hover gradient effect */}
    <div className="absolute inset-0 bg-gradient-to-br from-[#6c9ef8]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    
    <div className="relative z-10">
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm text-[#6c9ef8] font-bold">Room #{room.number}</div>
        <button
          onClick={e => { e.stopPropagation(); onDelete(room.id); }}
          className="text-gray-400 hover:text-red-400 transition-colors"
          title="Delete Room"
        >
          <Trash2 size={18} />
        </button>
      </div>
      <div className="text-xs text-gray-400 mb-3">
        Last updated: {room.lastUpdated}
      </div>
      <div className="bg-[#0f1419] rounded-lg p-3 border border-gray-800">
        <pre className="line-clamp-3 font-mono text-xs text-gray-300 overflow-hidden">
          {room.code.slice(0, 150)}{room.code.length > 150 ? "..." : ""}
        </pre>
      </div>
    </div>
  </motion.div>
);

const RoomProfile = () => {
  const navigate = useNavigate();
  const [created, setCreated] = useState([]);
  const [joined, setJoined] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showParticipateModal, setShowParticipateModal] = useState(false);
  const [roomCode, setRoomCode] = useState("");

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const [createdRes, joinedRes] = await Promise.all([
        fetch(`${API_URL}/api/room/my/created`, { credentials: "include" }),
        fetch(`${API_URL}/api/room/my/joined`, { credentials: "include" })
      ]);

      const createdData = await createdRes.json();
      const joinedData = await joinedRes.json();

      if (createdData.success) {
        setCreated(createdData.rooms.map(r => ({
          id: r.roomId,
          number: r.roomId, // Or use a sequence number if preferred
          lastUpdated: new Date(r.updatedAt).toISOString().slice(0, 10),
          code: r.code || "// No code saved"
        })));
      }

      if (joinedData.success) {
        setJoined(joinedData.rooms.map(r => ({
          id: r.roomId,
          number: r.roomId,
          lastUpdated: new Date(r.updatedAt).toISOString().slice(0, 10),
          code: r.code || "// No code saved"
        })));
      }
    } catch (error) {
      console.error("Fetch rooms error:", error);
      toast.error("Failed to load your rooms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const createRoom = () => {
    const newRoomId = Math.random().toString(36).slice(2, 9);
    navigate(`/editor?room=${newRoomId}`);
  };

  const participateRoom = () => {
    if (roomCode.trim()) {
      navigate(`/editor?room=${roomCode.trim()}`);
    }
  };

  const deleteCreated = async (id) => {
    if (!window.confirm("Are you sure you want to delete this room? This will remove it from history for everyone.")) return;
    try {
      const res = await fetch(`${API_URL}/api/room/${id}`, { method: "DELETE", credentials: "include" });
      const data = await res.json();
      if (data.success) {
        toast.success("Room deleted");
        fetchRooms();
      }
    } catch (error) {
      toast.error("Failed to delete room");
    }
  };

  const deleteJoined = async (id) => {
    if (!window.confirm("Are you sure you want to remove this room from your history?")) return;
    try {
      const res = await fetch(`${API_URL}/api/room/history/${id}`, { method: "DELETE", credentials: "include" });
      const data = await res.json();
      if (data.success) {
        toast.success("Removed from history");
        fetchRooms();
      }
    } catch (error) {
      toast.error("Failed to remove room");
    }
  };

  const enterRoom = room => {
    navigate(`/editor?room=${room.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a2332] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#6c9ef8] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a2332]">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Your Collaboration Spaces
          </h1>
          <p className="text-gray-400 text-lg">
            Create, join, and manage your coding rooms
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mb-10">
          <button
            onClick={createRoom}
            disabled={created.length >= MAX_ROOMS}
            className={`flex items-center gap-2 px-8 py-3 bg-[#6c9ef8] rounded-xl text-white font-semibold shadow-lg hover:bg-[#5a8de6] transition-all transform hover:scale-105
              ${created.length >= MAX_ROOMS ? "cursor-not-allowed opacity-50" : ""}`}
          >
            <Plus size={20} />
            Create Room
          </button>
          <button
            onClick={() => setShowParticipateModal(true)}
            disabled={joined.length >= MAX_ROOMS}
            className={`flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-semibold shadow-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105
              ${joined.length >= MAX_ROOMS ? "cursor-not-allowed opacity-50" : ""}`}
          >
            <Users size={20} />
            Participate Room
          </button>
        </div>

        {/* Created Rooms Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Code className="w-6 h-6 text-[#6c9ef8]" />
              Rooms You Created
              <span className="text-sm text-gray-400 font-normal ml-2">({created.length}/{MAX_ROOMS})</span>
            </h2>
          </div>
          {created.length === MAX_ROOMS && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-2 rounded-lg mb-4">
              ⚠️ Maximum limit reached! Delete a room to create more.
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {created.length > 0 ? (
              created.map(room => (
                <RoomCard key={room.id} room={room} onDelete={deleteCreated} onEnter={enterRoom} />
              ))
            ) : (
              <div className="col-span-3 text-center py-12 text-gray-500">
                No rooms created yet. Start by creating your first room!
              </div>
            )}
          </div>
        </div>

        {/* Participated Rooms Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-purple-400" />
              Rooms You Participate In
              <span className="text-sm text-gray-400 font-normal ml-2">({joined.length}/{MAX_ROOMS})</span>
            </h2>
          </div>
          {joined.length === MAX_ROOMS && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-2 rounded-lg mb-4">
              ⚠️ Maximum limit reached! Leave a room to join more.
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {joined.length > 0 ? (
               joined.map(room => (
                 <RoomCard key={room.id} room={room} onDelete={deleteJoined} onEnter={enterRoom} />
               ))
            ) : (
              <div className="col-span-3 text-center py-12 text-gray-500">
                No rooms joined yet. Enter a room code to participate!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Participate Room Modal */}
      {showParticipateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#1f2937] border border-gray-700 rounded-2xl p-8 max-w-md w-full shadow-2xl"
          >
            <h3 className="text-2xl font-bold text-white mb-2">Join a Room</h3>
            <p className="text-gray-400 text-sm mb-6">Enter the room code to start collaborating</p>
            <input
              type="text"
              value={roomCode}
              onChange={e => setRoomCode(e.target.value)}
              placeholder="Enter room code (e.g., 12345)"
              className="w-full bg-[#0f1419] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#6c9ef8] transition mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowParticipateModal(false)}
                className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={participateRoom}
                disabled={!roomCode.trim() || joined.length >= MAX_ROOMS}
                className="flex-1 px-4 py-3 bg-[#6c9ef8] hover:bg-[#5a8de6] text-white rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Join Room
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default RoomProfile;