// lib/socket.ts
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

// Ensures only one instance of the socket exists
export function getSocket() {
  if (socket) {
    return socket;
  }

  // Create or reconnect the socket
  socket = io("http://localhost:3001", {
    transports: ["websocket"], // optional but recommended
    autoConnect: true,
  });

  // Optional: built-in logging
  socket.on("connect", () => {
    console.log("[Socket.IO] connected:", socket?.id);
  });

  socket.on("disconnect", () => {
    console.log("[Socket.IO] disconnected");
  });

  socket.on("connect_error", (err) => {
    console.error("[Socket.IO] connection error:", err.message);
  });

  return socket;
}
