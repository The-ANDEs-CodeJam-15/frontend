// lib/socket.ts
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket() {
  if (socket) return socket;

  // Check if we're in the browser
  const savedSessionID = typeof window !== "undefined" 
    ? localStorage.getItem("sessionID") 
    : null;
  
  console.log("Saved session ID from localStorage:", savedSessionID);

  socket = io("http://localhost:3001", {
    transports: ["websocket"],
    autoConnect: true,
    auth: {
      sessionID: savedSessionID || null,
    },
  });

  socket.on("session", ({ sessionID }) => {
    // Only access localStorage in browser
    if (typeof window !== "undefined") {
      localStorage.setItem("sessionID", sessionID);
    }
    socket!.auth = { sessionID };
  });

  return socket;
}