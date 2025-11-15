// lib/socket.ts
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket() {
  if (socket) return socket;

  const savedSessionID = localStorage.getItem("sessionID");
  console.log("Saved session ID from localStorage:", savedSessionID);

  socket = io("http://localhost:3001", {
    transports: ["websocket"],
    autoConnect: true,
    auth: {
      sessionID: savedSessionID || null,
    },
  });

  socket.on("session", ({ sessionID }) => {
    localStorage.setItem("sessionID", sessionID);
    socket!.auth = { sessionID };
  });

  return socket;
}
