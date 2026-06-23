import io from "socket.io-client";

const socketUrl =
  import.meta.env.VITE_SOCKET_URL ||
  import.meta.env.VITE_API_URL ||
  "https://code-editor-collaboration-11.onrender.com";

const socket = io(socketUrl, {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export default socket;
