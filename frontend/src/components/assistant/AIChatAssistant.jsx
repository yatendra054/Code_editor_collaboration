import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, X, Bot, Wand2, Sparkles, User, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

/**
 * A custom markdown-to-react component that parses simple markdown.
 * Specifically handles code blocks and bold/italic text without external markdown packages.
 */
const SimpleMarkdown = ({ content }) => {
  if (!content) return null;

  // Split content into blocks of text and code
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-3 leading-relaxed text-sm">
      {parts.map((part, index) => {
        // If it's a code block
        if (part.startsWith("```")) {
          const match = part.match(/```(\w*)\n([\s\S]*?)```/);
          const lang = match ? match[1] : "javascript";
          const code = match ? match[2].trim() : part.slice(3, -3).trim();

          return (
            <div key={index} className="my-2 rounded-xl overflow-hidden border border-gray-700 shadow-inner">
              <div className="bg-gray-900 px-3 py-1 text-[10px] text-gray-400 flex justify-between border-b border-gray-700 uppercase font-mono">
                <span>{lang}</span>
                <span>snippet</span>
              </div>
              <SyntaxHighlighter
                language={lang}
                style={atomDark}
                customStyle={{ margin: 0, padding: '12px', fontSize: '12px', background: '#0f172a' }}
              >
                {code}
              </SyntaxHighlighter>
            </div>
          );
        }

        // If it's regular text, handle bold and newlines
        return (
          <p key={index} className="whitespace-pre-wrap">
            {part.split(/(\*\*.*?\*\*)/g).map((subPart, i) => {
              if (subPart.startsWith("**") && subPart.endsWith("**")) {
                return (
                  <strong key={i} className="text-indigo-400 font-bold">
                    {subPart.slice(2, -2)}
                  </strong>
                );
              }
              return subPart;
            })}
          </p>
        );
      })}
    </div>
  );
};

const AIChatAssistant = ({ socket, code, language, onApplyCode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I'm your CodeSync AI assistant. How can I help you with your code today?",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (!socket) return;

    const handleAIResponse = (response) => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.message,
          suggestedCode: response.suggestedCode,
        },
      ]);
    };

    socket.on("aiResponse", handleAIResponse);
    return () => socket.off("aiResponse", handleAIResponse);
  }, [socket]);

  const handleSend = () => {
    if (!input.trim() || !socket) return;

    const newUserMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, newUserMessage]);
    setInput("");
    setIsTyping(true);

    socket.emit("aiQuery", {
      prompt: input,
      code: code,
      language: language,
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-24 z-50 flex flex-col items-end">
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-96 max-w-[90vw] h-[550px] bg-gray-800 border border-gray-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 flex justify-between items-center shadow-lg relative">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                  <Bot size={22} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">CodeSync Assistant</h3>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-[10px] text-indigo-100 font-medium">Always active</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 p-2 rounded-xl transition-all duration-200"
              >
                <X size={20} className="text-white" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin scrollbar-thumb-gray-600 bg-gray-900/50 backdrop-blur-3xl">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[90%] group ${
                      msg.role === "user" ? "text-right" : "text-left"
                    }`}
                  >
                    <div
                      className={`inline-block rounded-2xl p-4 shadow-sm ${
                        msg.role === "user"
                          ? "bg-indigo-600 text-white rounded-tr-none"
                          : "bg-gray-800 text-gray-100 rounded-tl-none border border-gray-700"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2 opacity-60">
                        {msg.role === "user" ? (
                          <User size={12} className="ml-auto" />
                        ) : (
                          <Bot size={12} />
                        )}
                        <span className="text-[10px] font-bold uppercase tracking-widest font-mono">
                          {msg.role === "user" ? "Me" : "Assistant"}
                        </span>
                      </div>
                      
                      <SimpleMarkdown content={msg.content} />

                      {msg.suggestedCode && (
                        <div className="mt-4 pt-3 border-t border-gray-700/50 flex flex-col gap-2">
                           <button
                            onClick={() => onApplyCode(msg.suggestedCode)}
                            className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white text-[11px] font-bold py-2.5 px-4 rounded-xl transition-all shadow-lg active:scale-[0.98] group"
                          >
                            <Wand2 size={16} className="group-hover:rotate-12 transition-transform duration-300" />
                            Apply Changes to Editor
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                   <div className="bg-gray-800 rounded-2xl rounded-tl-none p-4 border border-gray-700 shadow-sm">
                    <div className="flex gap-1.5 items-center h-4">
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce"></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="p-5 bg-gray-800 border-t border-gray-700 shadow-[0_-4px_20px_rgba(0,0,0,0.3)] z-10">
              <div className="relative flex items-center gap-3">
                <div className="relative flex-1 group">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Ask anything..."
                    className="w-full bg-gray-900 border border-gray-700 rounded-2xl py-3 px-4 pr-12 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 ring-offset-2 ring-offset-gray-800 transition-all resize-none max-h-32"
                    rows="1"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all ${
                      input.trim() && !isTyping
                        ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 active:scale-90"
                        : "text-gray-600 cursor-not-allowed opacity-50"
                    }`}
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
              <div className="mt-3 flex justify-center items-center gap-2 opacity-30">
                <div className="h-[1px] w-8 bg-gray-500"></div>
                <span className="text-[9px] uppercase tracking-widest font-black text-gray-500">
                  Powered by Groq LLM
                </span>
                <div className="h-[1px] w-8 bg-gray-500"></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-[24px] flex items-center justify-center shadow-2xl transition-all duration-500 relative group overflow-hidden ${
          isOpen
            ? "bg-gray-700 text-white rounded-[20px]"
            : "bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 text-white"
        }`}
      >
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        {isOpen ? (
          <X size={32} strokeWidth={2.5} />
        ) : (
          <div className="relative flex items-center justify-center">
            <Bot size={32} strokeWidth={2.2} />
            <Sparkles size={16} className="absolute -top-1 -right-2 text-indigo-200 animate-pulse drop-shadow-sm" />
          </div>
        )}
        {!isOpen && (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-gray-900 rounded-full"></div>
        )}
      </motion.button>
    </div>
  );
};

export default AIChatAssistant;
