import React from "react";
import { 
  FiCode, 
  FiTerminal, 
  FiPlay, 
  FiCopy, 
  FiTrash2, 
  FiAlertCircle, 
  FiCheckCircle,
  FiChevronUp,
  FiChevronDown
} from "react-icons/fi";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

const InputOutputTabs = ({ 
  activeTab, 
  setActiveTab, 
  userInput, 
  onInputChange, 
  inputError, 
  language, 
  output, 
  onRunCode, 
  isExecuting,
  isPanelCollapsed,
  togglePanel
}) => {
  
  const copyOutput = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      toast.success("Output copied to clipboard!");
    }
  };

  const clearInput = () => {
    onInputChange({ target: { value: "" } });
    toast.info("Input cleared");
  };

  return (
    <div className="h-full flex flex-col bg-gray-900/50 backdrop-blur-sm overflow-hidden">
      {/* Tab Header */}
      <div className="flex bg-gray-800/80 border-b border-gray-700/50 relative min-h-12 backdrop-blur-sm">
        <button
          className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-3 border-r border-gray-700/50 transition-all duration-200 font-medium text-sm ${
            activeTab === "input" 
              ? "bg-blue-500/20 text-blue-400 border-b-2 border-blue-500" 
              : "text-gray-400 hover:text-white hover:bg-gray-700/50"
          }`}
          onClick={() => {
            setActiveTab("input");
            if (isPanelCollapsed) togglePanel();
          }}
        >
          <FiCode size={16} />
          <span className="hidden xs:inline">Input</span>
        </button>
        <button
          className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-3 border-r border-gray-700/50 transition-all duration-200 font-medium text-sm ${
            activeTab === "output" 
              ? "bg-green-500/20 text-green-400 border-b-2 border-green-500" 
              : "text-gray-400 hover:text-white hover:bg-gray-700/50"
          }`}
          onClick={() => {
            setActiveTab("output");
            if (isPanelCollapsed) togglePanel();
          }}
        >
          <FiTerminal size={16} />
          <span className="hidden xs:inline">Output</span>
        </button>
        
        {/* Toggle Panel Button (Slide Up/Down) */}
        <button
          className="flex items-center justify-center px-4 hover:bg-gray-700/50 text-gray-400 hover:text-white transition-all duration-200 border-r border-gray-700/50"
          onClick={togglePanel}
          title={isPanelCollapsed ? "Expand Panel (Slide Up)" : "Collapse Panel (Slide Down)"}
        >
          {isPanelCollapsed ? <FiChevronUp size={20} className="animate-bounce-slow" /> : <FiChevronDown size={20} />}
        </button>

        {/* Run Button (Hidden on mobile to defer to floating FAB) */}
        <button
          className="hidden md:flex absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 items-center gap-1 sm:gap-2 bg-green-500 hover:bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 shadow-lg text-sm"
          onClick={onRunCode}
          disabled={isExecuting || !!inputError}
          title={isExecuting ? "Executing..." : inputError || "Run code (Ctrl+Enter)"}
        >
          {isExecuting ? (
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span className="hidden sm:inline text-sm">Running</span>
            </div>
          ) : (
            <>
              <FiPlay size={16} />
              <span className="text-sm font-medium">Run</span>
            </>
          )}
        </button>
      </div>

      {/* Tab Content with Animation */}
      <AnimatePresence initial={false}>
        {!isPanelCollapsed && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex-1 flex flex-col bg-gray-900/30 overflow-hidden"
          >
            {activeTab === "input" && (
              <div className="flex-1 flex flex-col p-3 sm:p-6 min-h-0">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300 text-sm font-medium">Program Input</span>
                  </div>
                  {userInput && (
                    <button 
                      className="text-gray-400 hover:text-red-400 transition-colors duration-200 p-2 rounded-lg hover:bg-red-500/10"
                      onClick={clearInput}
                      title="Clear input"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  )}
                </div>
                <div className="flex-1 relative min-h-[100px]">
                  <textarea
                    className={`w-full h-full bg-gray-800/80 border-2 ${
                      inputError ? "border-red-500/50" : "border-gray-700/50"
                    } rounded-xl p-4 text-white font-mono text-sm focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 resize-none backdrop-blur-sm`}
                    value={userInput}
                    onChange={onInputChange}
                    placeholder={`Enter input for your ${language} program...`}
                  />
                </div>
                {/* Enhanced Error Display */}
                <div className={`mt-4 p-3 rounded-lg border flex items-start gap-3 transition-colors duration-300 ${
                  inputError 
                    ? "bg-red-500/10 border-red-500/20" 
                    : "bg-blue-500/10 border-blue-500/20"
                }`}>
                  {inputError ? (
                    <>
                      <FiAlertCircle className="text-red-400 mt-0.5 flex-shrink-0" size={16} />
                      <div className="text-red-300 text-xs font-medium">
                        {inputError}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-blue-300 text-xs font-medium">
                      {language === "java" || language === "cpp"
                        ? '💡 Tip: Enter numbers or strings in double quotes (e.g., 42 or "hello")'
                        : "💡 Tip: Enter any input your program needs to read from stdin"}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {activeTab === "output" && (
              <div className="flex-1 flex flex-col p-3 sm:p-6 min-h-0">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-gray-300 text-sm font-medium">Program Output</span>
                  </div>
                  {output && output !== "Output will appear here..." && output !== "Executing..." && (
                    <button 
                      className="text-gray-400 hover:text-green-400 transition-colors duration-200 p-2 rounded-lg hover:bg-green-500/10"
                      onClick={copyOutput}
                      title="Copy output"
                    >
                      <FiCopy size={16} />
                    </button>
                  )}
                </div>
                <div className="flex-1 relative min-h-[100px]">
                  <pre className="w-full h-full bg-gray-800/80 border-2 border-gray-700/50 rounded-xl p-4 text-white font-mono text-sm overflow-auto whitespace-pre-wrap backdrop-blur-sm box-border">
                    {output || "Output will appear here..."}
                  </pre>
                </div>
                {/* Enhanced Success/Status Display */}
                {output && output !== "Output will appear here..." && output !== "Executing..." && (
                  <div className="mt-4 bg-green-500/10 border border-green-500/20 p-3 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FiCheckCircle className="text-green-400" size={16} />
                      <span className="text-green-300 text-xs font-medium">Execution completed</span>
                    </div>
                    <span className="text-gray-400 text-xs font-mono bg-gray-800/50 px-2 py-1 rounded">
                      {output.split('\n').length} line(s)
                    </span>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InputOutputTabs;
