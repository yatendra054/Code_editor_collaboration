import React, { useState, useEffect, useRef } from "react";
import { FiMessageSquare, FiX, FiSend, FiChevronDown } from "react-icons/fi";

const ChatPanel = ({ socket, roomId, userName, joined }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setUnreadCount(0);
      inputRef.current?.focus();
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (!socket || !joined) return;

    // Listen for incoming messages
    const handleMessageReceived = (msg) => {
      setMessages((prev) => [...prev, msg]);
      if (!isOpen) {
        setUnreadCount((prev) => prev + 1);
      }
    };

    // Listen for chat history on join
    const handleChatHistory = (history) => {
      setMessages(history);
      // Determine unread count based on history if panel is closed (optional/heuristic)
      if (!isOpen && history.length > 0) {
        setUnreadCount(history.length);
      }
    };

    socket.on("chatMessageReceived", handleMessageReceived);
    socket.on("chatHistory", handleChatHistory);

    return () => {
      socket.off("chatMessageReceived", handleMessageReceived);
      socket.off("chatHistory", handleChatHistory);
    };
  }, [socket, joined, isOpen]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !socket || !joined) return;

    socket.emit("chatMessage", {
      roomId,
      userName,
      message: inputValue.trim(),
    });

    setInputValue("");
  };

  // Helper to format time
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Helper to get initials for avatar
  const getInitials = (name) => {
    return name ? name.substring(0, 2).toUpperCase() : "?";
  };

  if (!joined) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div 
          className="mb-4 w-80 sm:w-96 h-[450px] max-h-[70vh] flex flex-col glass-dark rounded-2xl shadow-2xl overflow-hidden chat-panel-enter transform transition-all duration-300"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 flex justify-between items-center shadow-md z-10">
            <div className="flex items-center gap-2 text-white">
              <FiMessageSquare size={18} />
              <h3 className="font-semibold">Room Chat</h3>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 p-1.5 rounded-lg transition-colors"
            >
              <FiChevronDown size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900/50 scrollbar-thin">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2 opacity-50">
                <FiMessageSquare size={32} />
                <p className="text-sm">No messages yet. Say hi!</p>
              </div>
            ) : (
              messages.map((msg, idx) => {
                const isMe = msg.userName === userName;
                return (
                  <div key={idx} className={`flex gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'} message-enter`}>
                    <div 
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${
                        isMe ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-200'
                      }`}
                    >
                      {getInitials(msg.userName)}
                    </div>
                    <div className={`flex flex-col max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
                      {!isMe && <span className="text-xs text-gray-400 ml-1 mb-1">{msg.userName}</span>}
                      <div 
                        className={`px-3 py-2 rounded-2xl shadow-sm text-sm ${
                          isMe 
                            ? 'bg-blue-500 text-white rounded-tr-sm' 
                            : 'bg-gray-800 text-gray-100 border border-gray-700 rounded-tl-sm'
                        }`}
                      >
                        {msg.message}
                      </div>
                      <span className="text-[10px] text-gray-500 mt-1 mx-1">
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-gray-800/80 border-t border-gray-700/50 backdrop-blur-md">
            <form onSubmit={handleSendMessage} className="flex gap-2 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-gray-900 border border-gray-600 text-white text-sm rounded-full pl-4 pr-10 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder-gray-500"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className={`absolute right-1 top-1 bottom-1 p-2 rounded-full flex items-center justify-center transition-all ${
                  inputValue.trim() 
                    ? 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-105 active:scale-95' 
                    : 'text-gray-500 bg-transparent'
                }`}
              >
                <FiSend size={14} className={inputValue.trim() ? "translate-x-[1px] translate-y-[1px]" : ""} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-4 rounded-full shadow-2xl text-white transform transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center relative ${
          isOpen ? 'bg-gray-700 hover:bg-gray-600' : 'bg-blue-600 hover:bg-blue-500 animate-glow'
        }`}
      >
        {isOpen ? <FiX size={24} /> : <FiMessageSquare size={24} />}
        
        {/* Unread Badge */}
        {!isOpen && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-gray-900 animate-bounce shadow-lg">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>
    </div>
  );
};

export default ChatPanel;
