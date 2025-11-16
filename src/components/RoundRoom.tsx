import { getSocket } from "../lib/socket";
import { useEffect, useState } from "react";
import FancyTimer from "./FancyTimer";

type Song = { name: string; artist: string; cover: string };

export type RoundProps = {
  onSetCurse: (otps : { userName: string }) => Promise<void> | void;

  song: Song;
  round: number,
  errorMessage?: string;
};

const RoundRoom: React.FC<RoundProps> = ({
    onSetCurse,
    round,
    errorMessage = null,
}) => {
  const totalTime = 30;
  const [timeRemaining, setTimeRemaining] = useState(totalTime);

  //ADD SONG-PLAYING LOGIC
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 relative px-6">
      {/* Center Column */}
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-2xl font-black">Round {round}</h1>

        {errorMessage && (
          <div className="mb-4 rounded-xl bg-red-900/40 px-3 py-2 text-sm text-red-200">
            {errorMessage}
          </div>
        )}

        {/* Progress Bar */}
    <div className="w-full mt-4">
      <div className="h-3 bg-neutral-800 rounded-full overflow-hidden relative border border-white/30 shadow-[0_0_4px_1px_rgba(255,255,255,0.2)]">
        <div
          className={`h-full transition-all duration-300 ease-linear ${
            timeRemaining <= 3 ? "bg-red-500" : "bg-gradient-to-r from-emerald-500 to-emerald-400"
          } `}
          style={{ width: `${(1 - timeRemaining / totalTime) * 100}%` }}
        />
      </div>
    </div>
    </div>

      {/* Timer - Right side */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2">
        <FancyTimer timeRemaining={timeRemaining} totalTime={totalTime} />
      </div>
    </main>
  );
};

export default RoundRoom;