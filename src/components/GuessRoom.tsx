import { getSocket } from "../lib/socket";
import { useEffect, useState } from "react";
import FancyTimer from "./FancyTimer";
import SongSearch from "./SongSearch";
import { SongSearchProps } from "./SongSearch";
import { Song } from "../lib/types"

export type GuessProps = {
  // onSetCurse: (otps : { userName: string }) => Promise<void> | void;

  entry: string;
  setEntry: React.Dispatch<React.SetStateAction<string>>;
  dropDownData: Song[]
  onSelectSong: (song: Song) => void;
  onSubmitSong: (song?: Song) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isBlocked: boolean;
  setIsBlocked: any;
  isCorrect: boolean,
  guessed: boolean;
  newCurses: number;

  //song: Song;
  //round: number,
  //errorMessage?: string;
};

const songOptions = [""];

const GuessRoom: React.FC<GuessProps> = ({
  entry,
  setEntry,
  dropDownData,
  onSelectSong,
  onSubmitSong,
  handleChange,
  isBlocked,
  setIsBlocked,
  isCorrect,
  guessed,
  newCurses,
  //round,
  //errorMessage = null,
}) => {
  const totalTime = 30;
  const [timeRemaining, setTimeRemaining] = useState(totalTime);


  const songSearchProps: SongSearchProps = {
    entry,
    setEntry,
    dropDownData,
    onSelectSong,
    onSubmitSong,
    handleChange,
    isBlocked,
    setIsBlocked,
  }

  return (
    <main className="flex min-h-screen items-start justify-center bg-neutral-950 relative px-6">
      <div className="flex flex-col items-center gap-4 w-full max-w-md">
        {guessed && <h1 className={`text-xl font-extrabold"> ${isCorrect ? "text-emerald-500" : "text-red-500"} `}>
          {isCorrect ? `Correct! +${newCurses} Curses` : "Incorrect."}
        </h1>}
        {!guessed && <h1 className={`text-xl font-extrabold text-gray-500">`}></h1>}
        {/* Center Column */}
        <div className="flex flex-col items-center gap-6">

          {/*<h1 className="text-2xl font-black">Round {round}</h1>*/}

          {/*errorMessage && (
          <div className="mb-4 rounded-xl bg-red-900/40 px-3 py-2 text-sm text-red-200">
            {errorMessage}
          </div>
        )*/}

          {/* Progress Bar */}
          {/* <div className="w-full mt-4">
            <div
              className={`h-full transition-all duration-1000 ease-linear overflow-hidden relative border border-white/30 shadow-[0_0_4px_1px_rgba(255,255,255,0.2)]
                ${timeRemaining <= 3 ? "bg-red-500" : "bg-gradient-to-r from-emerald-500 to-emerald-400"
                } `}
              style={{ width: `${(1 - timeRemaining / totalTime) * 100}%` }}
            />
        </div> */}
        </div>

        <div className="w-full max-w-md relative">
          <SongSearch {...songSearchProps} />
        </div>
      </div>
    </main>
  );
};

export default GuessRoom;