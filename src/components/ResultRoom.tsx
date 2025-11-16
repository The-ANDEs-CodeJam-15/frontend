import { getSocket } from "../lib/socket";
import { useEffect, useState } from "react";
import { Player, Song } from "../lib/types";
import FancyTimer from "./FancyTimer";

export type ResultProps = {
  guess: Song;
  song: Song;
  players: Player[];
};

const ResultRoom: React.FC<ResultProps> = ({
  guess,
  song,
  players,
}) => {
  const totalTime = 5;
  const [timeRemaining, setTimeRemaining] = useState(totalTime);
  const guessedRight = guess.name == song.name && guess.artist == song.artist;

  const sortedPlayers = [...players].sort((a, b) => b.points - a.points);

  //ADD SONG-PLAYING LOGIC
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 relative px-6">
      {/* Center Column */}
      <div className="flex flex-col items-center gap-6">

        {/* {errorMessage && (
          <div className="mb-4 rounded-xl bg-red-900/40 px-3 py-2 text-sm text-red-200">
            {errorMessage}
          </div>
        )} */}

        {/* <h1 className="text-2xl font-black">Round {round}</h1> */}
        <h1
          className={`text-xl font-extrabold ${guessedRight ? "text-emerald-500" : "text-red-500"
            }`}
        >
          {guessedRight ? "Correct!" : "Incorrect."}
        </h1>
        <p className="text-l">Your guess: <span className="font-semibold">{guess.name} - {guess.artist}</span></p>

        <h2 className="text-2xl font-black">Answer:</h2>

        <h1 className="text-2xl font-black">Song: {song.name} - {song.artist}</h1>

        {/* Song cover */}
        <img
          src={song.cover}
          className="w-6 h-6 gap-2"
        />

        {/* Leaderboard table */}
        <div className="w-full max-w-md mx-auto">
          <h2 className="text-xl font-bold text-neutral-100 mb-2">Leaderboard</h2>

          <table className="w-full border-collapse rounded-xl overflow-hidden">
            <thead className="bg-neutral-800 text-neutral-300 text-sm">
              <tr>
                <th className="py-2 px-3 text-left">Rank</th>
                <th className="py-2 px-3 text-left">Player</th>
                <th className="py-2 px-3 text-right">Points</th>
              </tr>
            </thead>

            <tbody className="text-neutral-100">
              {sortedPlayers.map((player, index) => {
                const tinted = player.color
                  .replace("hsl", "hsla")
                  .replace(")", ", 0.25)");

                return (
                  <tr
                    key={player.userName}
                    className="border-t border-neutral-700 hover:brightness-110 transition"
                    style={{ backgroundColor: tinted }}
                  >
                    <td className="py-2 px-3">{index + 1}</td>

                    <td className="py-2 px-3 flex items-center gap-2">
                      <span
                        className="inline-block w-3 h-3 rounded-full"
                        style={{ backgroundColor: player.color }}
                      />
                      {player.userName}
                    </td>

                    <td className="py-2 px-3 text-right font-bold">
                      {player.points}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

      {/* Timer - Right side */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2">
        <FancyTimer timeRemaining={timeRemaining} totalTime={totalTime} />
      </div>
    </main>
  );
};

export default ResultRoom;