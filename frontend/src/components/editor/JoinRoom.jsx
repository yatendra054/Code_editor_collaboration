import React, { useState } from "react";
import { FiRefreshCw, FiUser, FiHash, FiLock, FiArrowRight } from "react-icons/fi";
import { toast } from "react-toastify";
import { generateRoomId } from "../../utils/constants";

const JoinRoom = ({ onJoin }) => {
  const [roomId, setRoomId] = useState(generateRoomId());
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!roomId.trim()) newErrors.roomId = "Room ID is required";
    if (!userName.trim()) newErrors.userName = "Username is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const joinRoom = () => {
    if (validateForm()) {
      setIsJoining(true);
      onJoin(roomId, userName, password);
      // We don't necessarily set isJoining back to false here because 
      // the component will either unmount (success) or we handle error via props/toast
      // But for better UX if the request is fast or fails locally:
      setTimeout(() => setIsJoining(false), 2000); 
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      joinRoom();
    }
  };

  const generateNewRoomId = () => {
    const newId = generateRoomId();
    setRoomId(newId);
    setErrors(prev => ({ ...prev, roomId: "" }));
    toast.info(`New Room ID generated`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center py-20 px-4 sm:px-8">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-2xl w-full max-w-md transform transition-all hover:scale-[1.01]">
          <h1 className="text-3xl font-bold text-white mb-2 text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Join Code Room
          </h1>
          <p className="text-gray-400 text-center mb-8">Enter specific room details or create a new one</p>

          <div className="space-y-6">
            {/* Room ID Input */}
            <div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <FiHash size={20} />
                </div>
                <input
                  type="text"
                  placeholder="Room ID"
                  value={roomId}
                  onChange={(e) => {
                    setRoomId(e.target.value);
                    if (errors.roomId) setErrors(prev => ({ ...prev, roomId: "" }));
                  }}
                  onKeyPress={handleKeyPress}
                  disabled={isJoining}
                  className={`w-full pl-12 pr-12 py-3 bg-gray-900/50 border ${
                    errors.roomId ? "border-red-500/50 focus:border-red-500" : "border-gray-600/50 focus:border-blue-500/50"
                  } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${
                    errors.roomId ? "focus:ring-red-500/20" : "focus:ring-blue-500/20"
                  } transition-all duration-300 backdrop-blur-sm ${isJoining ? "opacity-50 cursor-not-allowed" : ""}`}
                />
                <button 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-blue-300 transition-colors p-1 rounded-lg hover:bg-blue-500/10"
                  onClick={generateNewRoomId}
                  title="Generate new Room ID"
                  disabled={isJoining}
                >
                  <FiRefreshCw size={18} />
                </button>
              </div>
              {errors.roomId && (
                <p className="text-red-400 text-xs mt-1 ml-1">{errors.roomId}</p>
              )}
            </div>

            {/* Username Input */}
            <div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <FiUser size={20} />
                </div>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={userName}
                  onChange={(e) => {
                    setUserName(e.target.value);
                    if (errors.userName) setErrors(prev => ({ ...prev, userName: "" }));
                  }}
                  onKeyPress={handleKeyPress}
                  disabled={isJoining}
                  className={`w-full pl-12 pr-4 py-3 bg-gray-900/50 border ${
                    errors.userName ? "border-red-500/50 focus:border-red-500" : "border-gray-600/50 focus:border-blue-500/50"
                  } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${
                    errors.userName ? "focus:ring-red-500/20" : "focus:ring-blue-500/20"
                  } transition-all duration-300 backdrop-blur-sm ${isJoining ? "opacity-50 cursor-not-allowed" : ""}`}
                />
              </div>
              {errors.userName && (
                <p className="text-red-400 text-xs mt-1 ml-1">{errors.userName}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <FiLock size={20} />
                </div>
                <input
                  type="password"
                  placeholder="Room Password (Optional)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isJoining}
                  className={`w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-300 backdrop-blur-sm ${isJoining ? "opacity-50 cursor-not-allowed" : ""}`}
                />
              </div>
            </div>

             <button 
              className={`w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3.5 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2 group ${isJoining ? "opacity-70 cursor-not-allowed" : ""}`}
              onClick={joinRoom}
              disabled={isJoining}
            >
              {isJoining ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Joining...</span>
                </>
              ) : (
                <>
                  <span>Join Room</span>
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>

          <p className="text-gray-400 text-sm text-center mt-6">
            Share this Room ID with your team to collaborate
          </p>
        </div>
      </div>
    </div>
  );
};

export default JoinRoom;