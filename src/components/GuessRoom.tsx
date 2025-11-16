import { getSocket } from "../lib/socket";
import { useEffect, useState } from "react";
import FancyTimer from "./FancyTimer";


type Song = { name: string; artist: string };

export type GuessProps = {
  // onSetCurse: (otps : { userName: string }) => Promise<void> | void;

  // guess: string;
  // setGuess: React.Dispatch<React.SetStateAction<string>>;

  //song: Song;
  //round: number,
  //errorMessage?: string;
};

const songOptions = [""];

const GuessRoom: React.FC<GuessProps> = ({
  // guess,
  // setGuess,
  //round,
  //errorMessage = null,
}) => {
  const totalTime = 30;
  const [timeRemaining, setTimeRemaining] = useState(totalTime);

  const [guess, setGuess] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  //cooldown and filtering (PROBABLY DOESN'T WORK)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGuess(value);

    // Clear previous timer if user types quickly
    if (debounceTimer) clearTimeout(debounceTimer);

    // Set a new timer
    const timer = setTimeout(async () => {
      if (value.length > 0) {
        const filtered = await getSocket().emitWithAck("getSongOptions", value);
        setFilteredOptions(filtered);
      } else {
        setFilteredOptions([]);
      }
    }, 1000); // 1 second delay

    setDebounceTimer(timer);
  };

  const handleSelect = (option: string) => {
    setGuess(option);
    setFilteredOptions([]);
  };


  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 relative px-6">
      {/* Center Column */}
      <div className="flex flex-col items-center gap-6">
        {/*<h1 className="text-2xl font-black">Round {round}</h1>*/}

        {/*errorMessage && (
          <div className="mb-4 rounded-xl bg-red-900/40 px-3 py-2 text-sm text-red-200">
            {errorMessage}
          </div>
        )*/}

        {/* Progress Bar */}
        <div className="w-full mt-4">
          <div className="h-3 bg-neutral-800 rounded-full overflow-hidden relative border border-white/30 shadow-[0_0_4px_1px_rgba(255,255,255,0.2)]">
            <div
              className={`h-full transition-all duration-300 ease-linear ${timeRemaining <= 3 ? "bg-red-500" : "bg-gradient-to-r from-emerald-500 to-emerald-400"
                } `}
              style={{ width: `${(1 - timeRemaining / totalTime) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="w-full max-w-md relative">
        {/* Guessing Textfield */}
        <input
          type="text"
          placeholder="Guess the song!"
          value={guess}
          onChange={handleChange}
          className="w-full bg-neutral-900 px-3 py-2 text-sm text-neutral-100 outline-none ring-0 transition placeholder:text-neutral-500 focus:border-neutral-400"
        />

        {/* Dropdown suggestions */}
        {filteredOptions.length > 0 && (
          <ul className="absolute mt-1 w-full bg-neutral-800 shadow-lg max-h-48 overflow-y-auto z-10">
            {filteredOptions.map((option) => (
              <li
                key={option}
                onClick={() => handleSelect(option)}
                className="px-3 py-2 cursor-pointer hover:bg-neutral-700 transition"
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Timer - Right side */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2">
        <FancyTimer timeRemaining={timeRemaining} totalTime={totalTime} />
      </div>
    </main>
  );
};

export default GuessRoom;