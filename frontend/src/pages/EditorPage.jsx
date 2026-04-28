import React from "react";
import JoinRoom from "../components/editor/JoinRoom";
import CodeEditor from "../components/editor/CodeEditor";
import AIChatAssistant from "../components/assistant/AIChatAssistant";
import { useRoom } from "../context/RoomContext";

const EditorPage = () => {
  const roomProps = useRoom();
  const { joined, socket, code, language, handleCodeChange, handleJoin, isWaitingForApproval } = roomProps;

  if (isWaitingForApproval) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 px-4">
        <div className="bg-gray-800/50 backdrop-blur-xl p-10 rounded-3xl border border-gray-700/50 shadow-2xl text-center max-w-md w-full">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full"></div>
            <div className="relative flex justify-center">
              <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Awaiting Approval</h2>
          <p className="text-gray-400 leading-relaxed">
            The room creator has been notified.
            <br />
            Please wait for them to approve your entry.
          </p>
        </div>
      </div>
    );
  }

  if (!joined) {
    return <JoinRoom onJoin={handleJoin} />;
  }

  return (
    <div className="editor-page min-h-screen bg-gray-900 relative">
      <CodeEditor {...roomProps} />

      {/* AI Assistant Component */}
      <AIChatAssistant
        socket={socket}
        code={code}
        language={language}
        onApplyCode={(newCode) => handleCodeChange(newCode)}
      />
    </div>
  );
};

export default EditorPage;