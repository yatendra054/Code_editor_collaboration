import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";
import io from "socket.io-client";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { 
  DEFAULT_CODE, 
  generateRoomId, 
  INPUT_VALIDATORS, 
  API_URL 
} from "../utils/constants";
import { useAuth } from "./AuthContext";
import JoinApprovalToast from "../components/ui/JoinApprovalToast";

const RoomContext = createContext();

export const useRoom = () => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error("useRoom must be used within a RoomProvider");
  }
  return context;
};

export const RoomProvider = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  /* ------------------------------
     State Variables
  -------------------------------- */
  const [joined, setJoined] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(DEFAULT_CODE.javascript);
  const [users, setUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [remoteCursors, setRemoteCursors] = useState([]);
  const [staleCursors, setStaleCursors] = useState([]);
  const [lastEditor, setLastEditor] = useState(null);
  const [output, setOutput] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [isTyping, setIsTyping] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [inputError, setInputError] = useState("");
  const [activeTab, setActiveTab] = useState("input");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isWaitingForApproval, setIsWaitingForApproval] = useState(false);
  const [myPermissions, setMyPermissions] = useState({ read: true, write: false });
  const isRemoteUpdate = useRef(false);

  // Refs
  const typingTimeoutsRef = useRef(new Map());
  const cursorTimeoutsRef = useRef(new Map());
  const typingDebounceRef = useRef(null);
  const socketRef = useRef(null);

  /* ------------------------------
     Effect: On Mount
  -------------------------------- */
  useEffect(() => {
    setRoomId(generateRoomId());

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ------------------------------
     Effect: Socket Initialization
  -------------------------------- */
  useEffect(() => {
    const newSocket = io(API_URL, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to server");
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from server");
      setIsConnected(false);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Connection error:", error);
      toast.error("Connection error. Please try again.");
      setIsConnected(false);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  /* ------------------------------
     Utility Functions
  -------------------------------- */
  const validateInput = useCallback((input) => {
    const { valid, message } = INPUT_VALIDATORS[language](input);
    setInputError(valid ? "" : message);
    return valid;
  }, [language]);

  const leaveRoom = useCallback(() => {
    if (socketRef.current) socketRef.current.emit("leaveRoom");
    setJoined(false);
    setIsWaitingForApproval(false);
    setRoomId(generateRoomId());
    setUserName("");
    setUsers([]);
    setTypingUsers([]);
    setLastEditor(null);
    setCode(DEFAULT_CODE[language] || "");
    setOutput("");
    setUserInput("");
    setInputError("");
    setActiveTab("input");
    toast.info("Left the room");
  }, [language]);

  /* ------------------------------
    Effect: Navigation Guard (Guests Only)
  -------------------------------- */
  useEffect(() => {
    const isUserGuest = !user?._id;
    if (joined && isUserGuest && location.pathname !== "/editor") {
      console.log("Guest navigating away from editor, leaving room automatically.");
      leaveRoom();
    }
  }, [location.pathname, joined, user, leaveRoom]);

  /* ------------------------------
     Effect: Socket.io Event Listeners
  -------------------------------- */
  useEffect(() => {
    const activeSocket = socketRef.current;
    if (!activeSocket) return;

    const handleInitialState = ({
      code: initialCode,
      language: initialLanguage,
      input: initialInput,
      users: roomUsers,
    }) => {
      if (initialCode !== undefined && initialCode !== null) {
        setCode(initialCode);
      }
      if (initialLanguage && initialLanguage !== language) {
        setLanguage(initialLanguage);
        if (!initialCode) {
          setCode(DEFAULT_CODE[initialLanguage] || "");
        }
      }
      if (initialInput !== undefined) {
        setUserInput(initialInput);
        validateInput(initialInput);
      }
      if (roomUsers && Array.isArray(roomUsers)) {
        setUsers(roomUsers);
        const myId = user?._id?.toString() || socketRef.current?.id;
        const me = roomUsers.find(u => u.userId?.toString() === myId);
        if (me) {
          setMyPermissions(me.permissions || { read: true, write: me.role === 'host' });
        }
      }
      setIsWaitingForApproval(false);
    };

    const handleCodeUpdate = (newCode) => {
      isRemoteUpdate.current = true;
      setCode(newCode);
    };

    const handleUserJoined = (roomUsers) => {
      setUsers(roomUsers);
      const myId = user?._id?.toString() || socketRef.current?.id;
      const me = roomUsers.find(u => u.userId?.toString() === myId);
      if (me) {
        setMyPermissions(me.permissions || { read: true, write: me.role === 'host' });
      }
      const userNames = roomUsers.map(u => u.username);
      setRemoteCursors((prev) => prev.filter(c => userNames.includes(c.userName)));
      setTypingUsers((prev) => prev.filter(u => userNames.includes(u.userName)));
    };

    const handleUserTyping = ({ userName: typingUserName, line }) => {
      setTypingUsers((prev) => [
        ...prev.filter((u) => u.userName !== typingUserName),
        { userName: typingUserName, line },
      ]);
      setLastEditor({ userName: typingUserName, timestamp: Date.now() });
      setStaleCursors((prev) => prev.filter((c) => c.userName !== typingUserName));

      if (typingTimeoutsRef.current.has(typingUserName)) {
        clearTimeout(typingTimeoutsRef.current.get(typingUserName));
      }

      const timeoutId = setTimeout(() => {
        setTypingUsers((prev) => prev.filter((u) => u.userName !== typingUserName));
        typingTimeoutsRef.current.delete(typingUserName);
      }, 2000);

      typingTimeoutsRef.current.set(typingUserName, timeoutId);
    };

    const handleCursorUpdate = ({ userName: updateUserName, cursorPosition }) => {
      setRemoteCursors((prev) => {
        const filtered = prev.filter((c) => c.userName !== updateUserName);
        return [...filtered, { userName: updateUserName, cursorPosition }];
      });
    };

    const handleLanguageUpdate = (newLanguage) => {
      isRemoteUpdate.current = true;
      setLanguage(newLanguage);
      setCode(DEFAULT_CODE[newLanguage] || "");
      setUserInput("");
      setInputError("");
    };

    const handleCodeResponse = (response) => {
      try {
        if (response && response.run) {
          const output = response.run.output || response.run.stderr || "No output";
          setOutput(output);
          if (response.run.stderr && !response.run.output) {
            toast.warning("Code executed with warnings/errors");
          } else {
            toast.success("Code executed successfully!");
          }
        } else if (response && response.compile && response.compile.stderr) {
          setOutput(`Compilation Error:\n${response.compile.stderr}`);
          toast.error("Compilation failed!");
        } else if (response && response.output) {
          setOutput(response.output);
          toast.success("Code executed successfully!");
        } else if (response && response.error) {
          setOutput(`Error: ${response.error}`);
          toast.error("Execution failed!");
        } else {
          setOutput("Error: Unexpected response format");
          toast.error("Execution failed!");
        }
      } catch (error) {
        setOutput("Error: Failed to process response");
        toast.error("Execution failed!");
      }

      setIsExecuting(false);
      setActiveTab("output");
    };

    const handleInputUpdate = (newInput) => {
      setUserInput(newInput);
      validateInput(newInput);
    };

    activeSocket.on("codeError", (error) => {
      setOutput(`Error: ${error.message || "Unknown error occurred"}`);
      setIsExecuting(false);
      setActiveTab("output");
      toast.error("Code execution failed!");
    });

    activeSocket.on("joinError", (error) => {
      toast.error(error.message || "Failed to join room");
      setJoined(false);
    });

    activeSocket.on("roomClosed", (data) => {
      toast.error(data.message || "this room id not exist");
      setJoined(false);
      setIsWaitingForApproval(false);
    });

    activeSocket.on("incomingJoinRequest", ({ requestId, userName: requesterName }) => {
       toast.info(
         <JoinApprovalToast 
           userName={requesterName}
           onAccept={() => activeSocket.emit("approveJoinRequest", { requestId, approved: true })}
           onDecline={() => activeSocket.emit("approveJoinRequest", { requestId, approved: false })}
         />,
         {
           autoClose: false,
           closeOnClick: false,
           draggable: false,
           closeButton: false,
         }
       );
    });

    activeSocket.on("waitingForApproval", (data) => {
      setIsWaitingForApproval(true);
      toast.info(data.message || "Waiting for creator's approval...");
    });

    activeSocket.on("joinResponse", ({ approved, message }) => {
      setIsWaitingForApproval(false);
      if (approved) {
        toast.success("Request approved! Joining...");
      } else {
        toast.error(message || "Your request was declined.");
        setJoined(false);
      }
    });

    activeSocket.on("permissionsUpdated", ({ users: updatedUsers }) => {
      setUsers(updatedUsers);
      const myId = user?._id?.toString() || activeSocket.id;
      const me = updatedUsers.find(u => u.userId?.toString() === myId);
      if (me) {
        setMyPermissions(me.permissions);
        if (!me.permissions.write) {
          toast.info("Your write access has been restricted by the host.");
        } else {
          toast.success("Your write access has been restored.");
        }
      }
    });

    activeSocket.on("initialState", handleInitialState);
    activeSocket.on("codeUpdate", handleCodeUpdate);
    activeSocket.on("userJoined", handleUserJoined);
    activeSocket.on("userTyping", handleUserTyping);
    activeSocket.on("cursorUpdate", handleCursorUpdate);
    activeSocket.on("languageUpdate", handleLanguageUpdate);
    activeSocket.on("codeResponse", handleCodeResponse);
    activeSocket.on("inputUpdate", handleInputUpdate);

    return () => {
      if (activeSocket) {
        activeSocket.off("codeError");
        activeSocket.off("joinError");
        activeSocket.off("roomClosed");
        activeSocket.off("incomingJoinRequest");
        activeSocket.off("waitingForApproval");
        activeSocket.off("joinResponse");
        activeSocket.off("permissionsUpdated");
        activeSocket.off("initialState", handleInitialState);
        activeSocket.off("codeUpdate", handleCodeUpdate);
        activeSocket.off("userJoined", handleUserJoined);
        activeSocket.off("userTyping", handleUserTyping);
        activeSocket.off("cursorUpdate", handleCursorUpdate);
        activeSocket.off("languageUpdate", handleLanguageUpdate);
        activeSocket.off("codeResponse", handleCodeResponse);
        activeSocket.off("inputUpdate", handleInputUpdate);
      }
      typingTimeoutsRef.current.forEach(timer => clearTimeout(timer));
      typingTimeoutsRef.current.clear();
      cursorTimeoutsRef.current.forEach(timer => clearTimeout(timer));
      cursorTimeoutsRef.current.clear();
      clearTimeout(typingDebounceRef.current);
    };
  }, [language, user, validateInput]);

  /* ------------------------------
     Effect: Handle BeforeUnload
  -------------------------------- */
  useEffect(() => {
    const handleBeforeUnload = () => {
      const isUserGuest = !user?._id;
      if (joined && socketRef.current && isUserGuest) {
        socketRef.current.emit("leaveRoom");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [joined, user]);

  const handleJoin = (newRoomId, newUserName) => {
    if (!newRoomId.trim() || !newUserName.trim()) {
      toast.error("Please enter both room ID and your name");
      return;
    }
    if (!socketRef.current) return;
    socketRef.current.emit("join", { roomId: newRoomId, userName: newUserName, userId: user?._id || socketRef.current.id });
    setRoomId(newRoomId);
    setUserName(newUserName);
    setJoined(true);
    toast.success(`Joining room ${newRoomId}...`);
  };

  const handleCodeChange = (newCode, currentLine = 1) => {
    if (newCode === undefined || newCode === null || !socketRef.current) return;
    
    // If this change came from the socket, ignore it for local permission checks
    if (isRemoteUpdate.current) {
      isRemoteUpdate.current = false;
      return;
    }

    if (!myPermissions.write) {
       // Only toast if it's not already toasted recently to avoid spam
       if (!window._lastPermissionToast || Date.now() - window._lastPermissionToast > 3000) {
         toast.error("You do not have permission to edit this room");
         window._lastPermissionToast = Date.now();
       }
       return;
    }
    setCode(newCode);
    setLastEditor({ userName, timestamp: Date.now() });
    if (joined) {
      socketRef.current.emit("typing", { roomId, userName, line: currentLine });
      setIsTyping(true);
    }
    clearTimeout(typingDebounceRef.current);
    typingDebounceRef.current = setTimeout(() => {
      setIsTyping(false);
      if (joined) {
        socketRef.current.emit("codeChange", { roomId, code: newCode });
      }
    }, 500);
  };

  const handleCursorChange = (cursorPosition) => {
    if (joined && socketRef.current) {
      socketRef.current.emit("cursorMove", { roomId, userName, cursorPosition });
    }
  };

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    if (!myPermissions.write) {
       toast.error("You do not have permission to change language");
       return;
    }
    setLanguage(newLanguage);
    setCode(DEFAULT_CODE[newLanguage] || "");
    setUserInput("");
    setInputError("");
    setOutput("");
    if (joined && socketRef.current) {
      socketRef.current.emit("languageChange", { roomId, language: newLanguage });
    }
  };

  const handleInputChange = (e) => {
    const newInput = e.target.value;
    if (!myPermissions.write) {
       toast.error("You do not have permission to change input");
       return;
    }
    setUserInput(newInput);
    validateInput(newInput);
    if (joined && socketRef.current) {
      socketRef.current.emit("inputChange", { roomId, input: newInput });
    }
  };

  const runCode = () => {
    if (!joined) {
      toast.error("Please join a room first");
      return;
    }
    if (!myPermissions.write) {
      toast.error("You do not have permission to run code");
      return;
    }
    if (!socketRef.current || inputError || !code.trim()) return;

    if (!isExecuting) {
      setIsExecuting(true);
      setOutput("Executing...");
      setActiveTab("output");
      socketRef.current.emit("compileCode", {
        code: code.trim(),
        roomId,
        language,
        version: "*",
        input: userInput,
      });
      setTimeout(() => {
        if (isExecuting) {
          setIsExecuting(false);
          setOutput("Execution timed out. Please try again.");
          toast.error("Execution timed out");
        }
      }, 30000);
    }
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const saveSession = async () => {
    if (!user) {
      toast.error("Please login to save this session");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/room/save/${roomId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          language,
          code,
          input: userInput,
          output,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Session saved successfully!");
      } else {
        toast.error(data.message || "Failed to save session");
      }
    } catch (error) {
      console.error("Save session error:", error);
      toast.error("Failed to save session");
    }
  };

  const value = {
    joined,
    isWaitingForApproval,
    roomId,
    userName,
    language,
    code,
    users,
    typingUsers,
    remoteCursors,
    staleCursors,
    lastEditor,
    output,
    isExecuting,
    sidebarOpen,
    isTyping,
    userInput,
    inputError,
    activeTab,
    windowWidth,
    isConnected,
    socket: socketRef.current,
    permissions: myPermissions,
    handleJoin,
    leaveRoom,
    handleCodeChange,
    handleCursorChange,
    handleLanguageChange,
    handleInputChange,
    runCode,
    toggleSidebar,
    saveSession,
    setActiveTab,
    validateInput,
  };

  return (
    <RoomContext.Provider value={value}>
      {children}
    </RoomContext.Provider>
  );
};
