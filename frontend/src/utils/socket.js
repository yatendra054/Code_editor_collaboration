import io from "socket.io-client";

const socket = io("https://real-time-code-editor-2-1h4l.onrender.com", {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export default socket;
