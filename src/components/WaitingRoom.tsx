// components/RoomLobby.tsx
import React, { useEffect, useState } from "react";

export type WaitingRoomProps = {
  onStart: () => Promise<void> | void;
  isHost?: boolean;
  isStarting?: boolean;
  userName : string;
  roomCode : string;
};

const WaitingRoom: React.FC<WaitingRoomProps> = ({
  onStart,
  isHost = false,
  roomCode,
  userName,
  isStarting = false,
}) => {
    
  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    await onStart();
  };

  const infoText = isHost ? "Friends can join with this code" : "Waiting for host..."

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950">
      <div className="max-w-md rounded-2xl border border-neutral-800 bg-neutral-900/80 p-6 text-neutral-50 shadow-lg backdrop-blur">
        <h1 className="mb-4 text-xl font-bold text-center tracking-wider">Welcome, {userName}!</h1>
        <h3 className="text-l font-semibold">{infoText}</h3>
        <h1 className="mb-4 text-3xl font-bold text-center tracking-wider">{roomCode}</h1>
        <div className="mb-6 h-px bg-gradient-to-r from-transparent via-neutral-700 to-transparent" />

        {/* Start game */}
        <div className="mb-6 space-y-2">
          {isHost && (
            <button
            type="button"
            onClick={handleStart}
            disabled={isStarting}
            className="flex-1 rounded-full justify-center bg-emerald-500 px-4 py-2 text-sm font-medium text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isStarting ? "Starting…" : "Start game"}
          </button>
        )}
        </div>
      </div>
    </main>
  );
};

export default WaitingRoom;
