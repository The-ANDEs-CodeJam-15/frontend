// components/RoomLobby.tsx
import React, { useEffect, useState } from "react";

export type LobbyProps = {
  onHostRoom: (otps : { userName: string }) => Promise<void> | void;
  onJoinRoom: (opts: { userName: string, enteredCode: string }) => Promise<void> | void;
  userName: string;
  setUserName: React.Dispatch<React.SetStateAction<string>>;
  isLoadingHost?: boolean;
  isLoadingJoin?: boolean;
  errorMessage?: string;
};

const Lobby: React.FC<LobbyProps> = ({
  onHostRoom,
  onJoinRoom,
  userName,
  setUserName,
  isLoadingJoin = false,
  isLoadingHost = false,
  errorMessage = null,
}) => {
  const [enteredCode, setEnteredCode] = useState("");

  const handleHost = async (e: React.FormEvent) => {
    e.preventDefault();
    await onHostRoom( { userName: userName?.trim() } );
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enteredCode.trim()) return;
    console.log(userName, " is trying to join code ", enteredCode)
    await onJoinRoom({ userName: userName.trim(), enteredCode: enteredCode.trim() });
  };

  const CODE_LENGTH = 6;

  const displayValue = enteredCode.toUpperCase() + "_".repeat(
    CODE_LENGTH - enteredCode.length);

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950">
      <div className="max-w-md rounded-2xl border border-neutral-700 bg-neutral-800/80 p-6 text-neutral-50 shadow-lg backdrop-blur">
        <h2 className="text-xl font-semibold">Guess the Song <span className="font-semibold italic">(but Cursed)</span></h2>
        <p className="mb-4 text-s">Join or host a room to play with friends!</p>
        {errorMessage && (
          <div className="mb-4 rounded-xl bg-red-900/40 px-3 py-2 text-sm text-red-200">
            {errorMessage}
          </div>
        )}

        {/* Enter userName */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full rounded-xl bg-neutral-900 px-3 py-2 text-sm text-neutral-100 outline-none ring-0 transition placeholder:text-neutral-500 focus:border-neutral-400"
          />
        </div>

        <div className="mb-6 h-px bg-gradient-to-r from-transparent via-neutral-500 to-transparent" />

        {/* Host room */}
        <div className="mb-6 space-y-2">
          <h3 className="text-sm font-medium">Host a room</h3>
          <button
            onClick={handleHost}
            disabled={isLoadingHost}
            className="flex w-full items-center justify-center rounded-full
            bg-emerald-400
            px-3 py-2 text-sm font-medium hover:bg-blue-200 text-black transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoadingHost ? "Creating..." : "Host room"}
          </button>
        </div>

        <div className="mb-6 h-px bg-gradient-to-r from-transparent via-neutral-500 to-transparent" />

        {/* Join room */}
        <form onSubmit={handleJoin} className="space-y-2">
          <div>
            <h3 className="text-sm font-medium">Join a room</h3>
            <p className="text-xs text-neutral-400">
              Enter a room code
            </p>
          </div>

<div className="relative w-full">
    {/* Overlay display */}
    <div
      className="
        pointer-events-none absolute left-3 top-1/2 -translate-y-1/2
        text-sm tracking-[0.36em] text-neutral-300 z-10 font-mono
      "
    >
      {displayValue}
    </div>
          <input
            type="text"
            value={enteredCode}
            onChange={(e) =>
        setEnteredCode(e.target.value.toUpperCase().slice(0, CODE_LENGTH))
      }
      className="
        
        w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2
        text-sm text-transparent caret-neutral-100 outline-none
        ring-0 transition focus:border-neutral-400 font-mono
        tracking-[0.36em]
         
      "
          />
  </div>

          <button
            type="submit"
            disabled={isLoadingJoin || !enteredCode.trim()}
            className="flex w-full items-center justify-center rounded-full bg-blue-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoadingJoin ? "Joining..." : "Join room"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default Lobby;
