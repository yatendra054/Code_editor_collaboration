import React, { useRef, useEffect, useState } from "react";
import { FiMenu, FiX, FiPlay } from "react-icons/fi";
import Editor from "@monaco-editor/react";
import Sidebar from "./Sidebar";
import InputOutputTabs from "./InputOutputTabs";
import LoadingSkeleton from "../common/LoadingSkeleton";
import ChatPanel from "./ChatPanel";

const CodeEditor = ({ 
  sidebarOpen, 
  toggleSidebar, 
  windowWidth, 
  language, 
  code, 
  handleCodeChange, 
  handleCursorChange,
  roomId, 
  users, 
  userName, 
  typingUsers, 
  remoteCursors,
  lastEditor,
  handleLanguageChange, 
  leaveRoom, 
  activeTab, 
  setActiveTab, 
  userInput, 
  handleInputChange, 
  inputError, 
  output, 
  runCode, 
  isExecuting,
  isConnected,
  socket,
  joined,
  permissions
}) => {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const cursorDecorationsRef = useRef(null);
  const [now, setNow] = useState(Date.now());
  
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);

  const togglePanel = () => setIsPanelCollapsed(prev => !prev);
  
  // Timer for relative time updates ("1 min ago")
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleEditorMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    cursorDecorationsRef.current = editor.createDecorationsCollection([]);

    editor.onDidChangeCursorPosition((e) => {
      // e.reason: 0 (NotSet), 1 (ContentFlush), 2 (RecoverFromMarkers), 3 (Explicit), 4 (Paste), 5 (Undo), 6 (Redo)
      // We only want to broadcast explicit cursor moves or typing, not automatic shifts caused by incoming code chunks.
      if (e.reason === 0 || e.reason === 1 || e.reason === 2) {
        return;
      }
      // Broadcast cursor changes
      handleCursorChange(e.position);
    });
  };

  // Sync cursor position with code changes to broadcast current line
  const onCodeChange = (value) => {
    let emitLine = 1;
    if (editorRef.current) {
      const position = editorRef.current.getPosition();
      if (position) {
        emitLine = position.lineNumber;
        handleCursorChange(position); // Ensure the cursor engine tracks typing movements locally and remotely
      }
    }
    handleCodeChange(value, emitLine);
  };

  // Effect to update remote cursors
  useEffect(() => {
    if (!editorRef.current || !monacoRef.current || !cursorDecorationsRef.current) return;

    const model = editorRef.current.getModel();

    // Apply decorations
    const decorations = remoteCursors.map((cursor) => {
      // Create a safe CSS class name from the username
      const safeName = cursor.userName.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
      const cursorClass = `remote-cursor-${safeName}`;

      // Inject dynamic CSS for this specific user's tooltip if it doesn't exist
      if (!document.getElementById(`style-${cursorClass}`)) {
        const style = document.createElement("style");
        style.id = `style-${cursorClass}`;
        style.innerHTML = `
          .${cursorClass} {
            border-left: 2px solid #3b82f6;
            position: absolute;
            height: 100%;
            z-index: 100;
          }
          .${cursorClass}::before {
            content: "${cursor.userName}";
            position: absolute;
            top: -20px;
            left: -2px;
            background-color: #3b82f6;
            color: white;
            font-size: 10px;
            font-weight: 600;
            padding: 2px 6px;
            border-radius: 4px;
            border-bottom-left-radius: 0;
            white-space: nowrap;
            pointer-events: none;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            z-index: 101;
          }
        `;
        document.head.appendChild(style);
      }

      return {
        range: new monacoRef.current.Range(
          cursor.cursorPosition.lineNumber,
          cursor.cursorPosition.column,
          cursor.cursorPosition.lineNumber,
          cursor.cursorPosition.column
        ),
        options: {
          className: cursorClass,
          hoverMessage: { value: `**${cursor.userName}**` },
        },
      };
    });

    cursorDecorationsRef.current.set(decorations);

  }, [remoteCursors, code]);

  return (
    <div className="flex h-[calc(100vh-64px)] w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden relative">
      <Sidebar
        sidebarOpen={sidebarOpen}
        roomId={roomId}
        users={users}
        userName={userName}
        typingUsers={typingUsers}
        lastEditor={lastEditor}
        language={language}
        onLanguageChange={handleLanguageChange}
        onLeaveRoom={leaveRoom}
        isConnected={isConnected}
        socket={socket}
      />

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30" 
          onClick={toggleSidebar}
        />
      )}

      <div className="flex-1 flex flex-col relative w-full border-l border-gray-700/50 shadow-2xl">
        {/* Mobile Sidebar Toggle (Moved to be clearly visible over the editor) */}
        <button 
          className="md:hidden absolute top-4 right-4 z-20 bg-gray-800/90 hover:bg-gray-700 border border-gray-600 text-white p-2.5 rounded-xl shadow-xl transition-all duration-200 active:scale-95 backdrop-blur-sm"
          onClick={toggleSidebar}
        >
          {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>

        {/* Floating Mobile Run Button (Ensuring run is visible even when panels are shifted) */}
        <button 
          className="md:hidden absolute bottom-24 right-6 z-20 bg-green-500 hover:bg-green-600 shadow-green-500/30 text-white p-4 rounded-full shadow-2xl transition-all duration-200 active:scale-95 flex items-center justify-center"
          onClick={runCode}
          disabled={isExecuting || !!inputError}
        >
          {isExecuting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent flex rounded-full animate-spin" />
          ) : (
            <FiPlay size={20} className="fill-current" />
          )}
        </button>

        {/* Editor Section */}
        <div 
          className="flex-1 relative transition-all duration-300 ease-in-out overflow-hidden" 
          style={{ height: isPanelCollapsed ? "calc(100% - 48px)" : (windowWidth <= 768 ? "50%" : "60%") }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm"></div>
          <div className="relative z-10 h-full w-full">
            <Editor
              height="100%"
              language={language}
              value={code}
              onMount={handleEditorMount}
              onChange={onCodeChange}
              theme="vs-dark"
              options={{
                minimap: { enabled: windowWidth > 768 },
                fontSize: windowWidth <= 768 ? 12 : 14,
                automaticLayout: true,
                readOnly: !permissions.write,
                padding: { top: 20, bottom: 20 },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                cursorBlinking: 'smooth',
                renderLineHighlight: 'line',
                lineNumbers: 'on',
                glyphMargin: false,
                folding: windowWidth > 768,
                lineDecorationsWidth: 0,
                lineNumbersMinChars: windowWidth <= 768 ? 2 : 3,
                renderWhitespace: 'selection',
                wordWrap: 'on',
                bracketPairColorization: { enabled: true },
                scrollbar: {
                  verticalScrollbarSize: windowWidth <= 768 ? 8 : 10,
                  horizontalScrollbarSize: windowWidth <= 768 ? 8 : 10
                }
              }}
              loading={<LoadingSkeleton />}
            />
          </div>
        </div>

        {/* Input/Output Section */}
        <div 
          className="flex-none flex flex-col relative transition-all duration-300 ease-in-out overflow-hidden" 
          style={{ height: isPanelCollapsed ? "48px" : (windowWidth <= 768 ? "50%" : "40%") }}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-gray-800/50 to-gray-900/50 backdrop-blur-sm"></div>
          <div className="relative z-10 h-full w-full">
            <InputOutputTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              userInput={userInput}
              onInputChange={handleInputChange}
              inputError={inputError}
              language={language}
              output={output}
              onRunCode={runCode}
              isExecuting={isExecuting}
              isPanelCollapsed={isPanelCollapsed}
              togglePanel={togglePanel}
            />
          </div>
        </div>
      </div>
      
      {/* Real-Time Chat Panel Overlay */}
      <ChatPanel 
        socket={socket} 
        roomId={roomId} 
        userName={userName} 
        joined={joined} 
      />
    </div>
  );
};

export default CodeEditor;