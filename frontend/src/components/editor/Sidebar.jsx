import React, { useState, useEffect } from "react";
import { FiCopy, FiUsers, FiRefreshCw, FiGlobe, FiCode, FiClock, FiEdit, FiEdit3 } from "react-icons/fi";
import { toast } from "react-toastify";
import { SUPPORTED_LANGUAGES } from "../../utils/constants";
import { useAuth } from "../../context/AuthContext";
import { useRoom } from "../../context/RoomContext";
import { FiSave } from "react-icons/fi";

const Sidebar = ({ 
  sidebarOpen, 
  roomId, 
  users, 
  userName, 
  typingUsers, 
  lastEditor,
  language, 
  onLanguageChange, 
  onLeaveRoom,
  isConnected,
  socket 
}) => {
  const { user: currentUser } = useAuth();
  const { saveSession } = useRoom();
  const [now, setNow] = useState(Date.now());
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await saveSession();
    setIsSaving(false);
  };
  
  // Find current user object to check role
  const myId = currentUser?._id?.toString() || socket?.id;
  const me = users.find(u => u.userId?.toString() === myId);
  const isHost = me?.role === 'host';
  
  const handleTogglePermission = (targetUserId, type, currentValue) => {
    if (!isHost || !socket) return;
    
    const targetUser = users.find(u => u.userId === targetUserId);
    if (!targetUser) return;

    const newPermissions = {
      read: true,
      write: true,
      ...targetUser.permissions,
      [type]: !currentValue
    };

    socket.emit("updatePermissions", {
      roomId,
      targetUserId,
      permissions: newPermissions
    });
  };
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    toast.success("Room ID copied to clipboard!");
  };

  const getTypingMessage = () => {
    if (typingUsers.length === 0) return null;
    if (typingUsers.length === 1) return `${typingUsers[0].userName} is typing...`;
    if (typingUsers.length === 2) return `${typingUsers[0].userName} and ${typingUsers[1].userName} are typing...`;
    return `${typingUsers[0].userName} and ${typingUsers.length - 1} others are typing...`;
  };

  const currentLanguage = SUPPORTED_LANGUAGES.find(lang => lang.value === language);

  return (
    <div className={`fixed md:relative top-0 left-0 h-full w-72 sm:w-80 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col transition-all duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 z-40 shadow-2xl border-r border-gray-700 overflow-hidden`}>
      {/* Header Section */}
      <div className="p-6 pb-4 border-b border-gray-700/50 bg-gray-900/50 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <FiCode className="text-white" size={16} />
            </div>
            <h2 className="text-base sm:text-lg font-semibold text-white truncate max-w-[120px] sm:max-w-none">Room: {roomId}</h2>
          </div>
          <button 
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-2 sm:px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95 text-sm"
            onClick={copyRoomId}
          >
            <FiCopy size={14} />
            <span className="hidden sm:inline">Copy</span>
          </button>
        </div>
        <div className="flex items-center gap-2">
          {isConnected ? (
            <span className="text-sm font-bold text-green-400 animate-pulse tracking-wide">
              Online
            </span>
          ) : (
            <span className="text-sm font-bold text-red-500 animate-pulse tracking-wide">
              Offline
            </span>
          )}
        </div>
      </div>

      {/* Users Section */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="p-6 pb-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <FiUsers size={16} className="text-purple-400" />
            </div>
            <h3 className="font-semibold text-gray-200">Active Users</h3>
            <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs font-medium">
              {users.length}
            </span>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto px-6 pb-4">
          <div className="space-y-2">
            {users.map((user, idx) => {
              const isCurrentUser = user.userId === (currentUser?._id || socket?.id);
              
              return (
                <div 
                  key={idx} 
                  className={`flex flex-col gap-2 p-3 rounded-xl transition-all duration-200 hover:scale-[1.02] ${
                    isCurrentUser 
                      ? 'bg-blue-500/20 border border-blue-500/30 shadow-lg' 
                      : 'bg-gray-800/50 border border-gray-700/50 hover:bg-gray-800 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-2 h-2 flex-shrink-0 border-transparent">
                      <div className="absolute inset-0 bg-green-400 rounded-full animate-pulse"></div>
                      <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></div>
                    </div>
                    <span className="flex-1 text-gray-200 font-medium truncate">
                      {user.username} 
                      {isCurrentUser && <span className="text-blue-400 text-sm ml-1">(You)</span>}
                      {user.role === 'host' && (
                        <span className="ml-2 px-2 py-0.5 bg-yellow-500/20 text-yellow-500 text-[10px] font-bold uppercase rounded-md border border-yellow-500/30 tracking-tight">
                          Host
                        </span>
                      )}
                    </span>
                    {typingUsers.some((u) => u.userName === user.username) && (
                      <div className="flex items-center gap-1 text-yellow-400">
                        <div className="w-1 h-1 bg-yellow-400 rounded-full animate-bounce"></div>
                        <div className="w-1 h-1 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-1 h-1 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    )}
                  </div>

                  {/* Permissions Controls (Visible to Host for guests) */}
                  {isHost && user.role !== 'host' && (
                    <div className="flex items-center justify-end gap-3 mt-1 pt-2 border-t border-gray-700/30">
                      <button
                        onClick={() => handleTogglePermission(user.userId, 'write', user.permissions?.write ?? false)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200 border ${
                          (user.permissions?.write ?? false) 
                            ? 'text-green-400 bg-green-400/5 border-green-400/20 hover:bg-green-400/10' 
                            : 'text-gray-500 bg-gray-500/5 border-gray-500/20 hover:bg-gray-500/10'
                        }`}
                        title={(user.permissions?.write ?? false) ? "Disable Write Access" : "Enable Write Access"}
                      >
                        {(user.permissions?.write ?? false) ? <FiEdit size={14} /> : <FiEdit3 size={14} />}
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          {(user.permissions?.write ?? false) ? 'Can Edit' : 'Read Only'}
                        </span>
                      </button>
                    </div>
                  )}

                  {/* Guest's own view of their permissions */}
                  {!isHost && !isCurrentUser && user.role !== 'host' && (
                     <div className="flex items-center justify-end gap-2 text-[10px] text-gray-500 mt-1 uppercase font-bold tracking-widest opacity-50">
                        {(user.permissions?.write ?? false) ? 'Write' : 'Read-Only'}
                     </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Typing Indicator 
          (Removed from sidebar as it is now inline in CodeEditor)
      */}

      {/* Last Edited By Section */}
      {lastEditor && (
        <div className="px-6 pb-4">
          <div className="bg-gray-800/80 rounded-xl p-3 border border-gray-700/50 flex flex-col gap-1 shadow-lg">
            <h3 className="text-xs font-semibold text-gray-400 flex items-center gap-1.5 uppercase tracking-wider">
              <FiClock size={12} className="text-blue-400" /> Last Edit
            </h3>
            <div className="text-sm text-gray-200 flex flex-wrap items-baseline gap-1.5 mt-1">
              <span className="font-medium text-gray-100 truncate max-w-[120px]">{lastEditor.userName}</span> 
              <span className="text-gray-500 text-xs italic">
                {Math.floor(Math.max(0, now - lastEditor.timestamp) / 60000) < 1 
                  ? 'just now' 
                  : `${Math.floor(Math.max(0, now - lastEditor.timestamp) / 60000)} min${Math.floor(Math.max(0, now - lastEditor.timestamp) / 60000) > 1 ? 's' : ''} ago`}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Language Selection */}
      <div className="p-6 pt-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 bg-orange-500/20 rounded-lg flex items-center justify-center">
            <FiGlobe size={16} className="text-orange-400" />
          </div>
          <label className="text-sm font-medium text-gray-300">Programming Language</label>
        </div>
        <select
          value={language}
          onChange={onLanguageChange}
          className="w-full bg-gray-800/80 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 hover:border-gray-600"
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.icon} {lang.label}
            </option>
          ))}
        </select>
        {currentLanguage && (
          <div className="text-xs text-gray-400 mt-2 flex items-center gap-2">
            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
            Current: {currentLanguage.icon} {currentLanguage.label}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="p-6 pt-4 border-t border-gray-700/50 bg-gray-900/50 backdrop-blur-sm space-y-3">
        {currentUser && (
          <button 
            className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <FiSave size={16} />
            )}
            {isSaving ? "Saving..." : "Save Session"}
          </button>
        )}
        <button 
          className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-95"
          onClick={onLeaveRoom}
        >
          <FiRefreshCw size={16} />
          Leave Room
        </button>
      </div>
    </div>
  );
};

export default Sidebar;