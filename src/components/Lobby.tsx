// components/RoomLobby.tsx
import React, { useState } from "react";

export type LobbyProps = {
  onHostRoom: (opts: { roomName?: string }) => Promise<void> | void;
  onJoinRoom: (opts: { roomCode: string }) => Promise<void> | void;
  isLoadingHost?: boolean;
  isLoadingJoin?: boolean;
  errorMessage?: string;
};

const RoomLobby: React.FC<LobbyProps> = ({
  onHostRoom,
  onJoinRoom,
  isLoadingHost = false,
  isLoadingJoin = false,
  errorMessage = null,
}) => {
  const [roomName, setRoomName] = useState("");
  const [roomCode, setRoomCode] = useState("");

  const handleHost = async (e: React.FormEvent) => {
    e.preventDefault();
    await onHostRoom({ roomName: roomName.trim() || undefined });
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomCode.trim()) return;
    await onJoinRoom({ roomCode: roomCode.trim() });
  };

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-neutral-800 bg-neutral-900/80 p-6 text-neutral-50 shadow-lg backdrop-blur">
      <h2 className="mb-4 text-xl font-semibold">Guess the Song... but Cursed</h2>
      <p className="text-s">Join or host a room to play with friends!</p>
      {errorMessage && (
        <div className="mb-4 rounded-xl bg-red-900/40 px-3 py-2 text-sm text-red-200">
          {errorMessage}
        </div>
      )}

      {/* Host room */}
      <div className="mb-6 space-y-2">
        <h3 className="text-sm font-medium">Host a room...</h3>
        <button
          onClick={handleHost}
          disabled={isLoadingHost}
          className="flex w-full items-center justify-center rounded-full bg-emerald-500 px-3 py-2 text-sm font-medium text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoadingHost ? "Creating..." : "Host room"}
        </button>
      </div>

      <div className="mb-6 h-px bg-gradient-to-r from-transparent via-neutral-700 to-transparent" />

      {/* Join room */}
      <form onSubmit={handleJoin} className="space-y-2">
        <div>
          <h3 className="text-sm font-medium">Join a room</h3>
          <p className="text-xs text-neutral-400">
            ...or enter a room code
          </p>
        </div>

        <input
          type="text"
          placeholder="_ _ _ _ _ _"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
          className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm tracking-[0.18em] text-neutral-100 outline-none ring-0 transition placeholder:text-neutral-500 focus:border-neutral-400"
        />

        <button
          type="submit"
          disabled={isLoadingJoin || !roomCode.trim()}
          className="flex w-full items-center justify-center rounded-full bg-blue-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoadingJoin ? "Joining..." : "Join room"}
        </button>
      </form>
    </div>
  );
};

export default RoomLobby;
