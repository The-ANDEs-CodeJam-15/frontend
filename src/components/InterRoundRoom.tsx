import { getSocket } from "../lib/socket";
import { useEffect, useState } from "react";
import FancyTimer from "./FancyTimer";

//NOT SURE IF NEEDED
type Player = { userName: string; color: string; points: number };
type Curse = { name: string; effectFunction?: () => void; icon?: string };

export type InterRoundProps = {
  onSetCurse: (otps : { userName: string }) => Promise<void> | void;

  round: number,
  players: Player[];
  yourCurses: Curse[];
  errorMessage?: string;
};

const InterRoundRoom: React.FC<InterRoundProps> = ({
    onSetCurse,
    round,
    players,
    yourCurses,
    errorMessage = null,
}) => {
  const totalTime = 10;
  const [timeRemaining, setTimeRemaining] = useState(totalTime);

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 relative px-6">
      {/* Center Column */}
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-2xl font-black">Round {round}</h1>
        <h2 className="text-xl font-bold">Players</h2>

        {errorMessage && (
          <div className="mb-4 rounded-xl bg-red-900/40 px-3 py-2 text-sm text-red-200">
            {errorMessage}
          </div>
        )}

        {/* Player Circles */}
        <div className="flex gap-4">
          {players.map((player) => (
            <div key={player.userName} className="flex flex-col items-center gap-1">
              <div
                className="flex items-center justify-center w-16 h-16 rounded-full text-white font-bold border-2 border-white/50 shadow-[0_0_4px_2px_white]"
                style={{ backgroundColor: player.color }}
              >
                {player.userName}
              </div>
              {/* Player points below circle */}
              <span className="text-xs text-neutral-300">{player.points} pts</span>
            </div>
          ))}
        </div>

        {/* Curses */}
        <div className="flex flex-col gap-2 w-full">
          <span className="font-bold text-neutral-100 text-left w-full">Your curses:</span>

          <div className="flex gap-4">
            {yourCurses.map((curse) => (
              <div key={curse.name} className="flex flex-col items-center gap-1 relative group">
                {/* Name label */}
                <span className="text-xs text-neutral-300 text-center">{curse.name}</span>

                {/* Circle button */}
                <button
                  type="button"
                  onClick={() => curse.effectFunction?.()}
                  className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center overflow-hidden hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                  style={{
                    backgroundImage: curse.icon ? `url(${curse.icon})` : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundColor: curse.icon ? undefined : "#374151",
                  }}
                >
                  {!curse.icon && <span className="text-xs text-neutral-300">{curse.name[0]}</span>}
                </button>

                {/* Tooltip */}
                <span className="absolute bottom-full mb-1 hidden w-max max-w-xs rounded bg-neutral-800 px-2 py-1 text-xs text-white text-center opacity-0 group-hover:block group-hover:opacity-100 transition-opacity duration-150">
                  {curse.name} - {curse.effectFunction?.name || "Curse effect"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timer - Right side */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2">
        <FancyTimer timeRemaining={timeRemaining} totalTime={totalTime} />
      </div>
    </main>
  );
}

export default InterRoundRoom;