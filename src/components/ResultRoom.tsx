import { getSocket } from "../lib/socket";
import { useEffect, useState } from "react";
import { Player, Song } from "../lib/types";
import FancyTimer from "./FancyTimer";

export type ResultProps = {
  song?: Song;
  players: Player[];
};

const ResultRoom: React.FC<ResultProps> = ({
  song,
  players,
}) => {
  const totalTime = 5;
  const [timeRemaining, setTimeRemaining] = useState(totalTime);

  const sortedPlayers = [...players].sort((a, b) => b.points - a.points);

  //ADD SONG-PLAYING LOGIC
  return (
    <main className="flex min-h-screen items-start justify-center bg-neutral-950 relative px-6">
  {/* Two-column layout */}
  <div className="flex gap-12 w-full max-w-6xl">
    {/* Left Column: Answer + Cover */}
    <div className="flex flex-col flex-1 items-center justify-center gap-6 flex-shrink-0">
      <h1 className="text-2xl text-white font-extrabold">
        Answer
      </h1>

      {song && (
        <img
          src={song.cover}
          className="w-64 h-64 border-2 border-neutral-700 object-cover"
        />
      )}

      <h1 className={"text-l text-white"}>{song ? song.name : ""} - {song ? song.artist : ""}</h1>
    </div>

    {/* Right Column: Leaderboard */}
    <div className="flex-1">
      <h2 className="text-2xl font-extrabold text-white text-center mb-2">Leaderboard</h2>
      <div className="flex justify-center">
      <table className="w-2/3 border-collapse rounded-xl overflow-hidden">
        <thead className="bg-neutral-800 text-neutral-300 text-sm">
          <tr>
            <th className="py-2 px-3 text-left">Rank</th>
            <th className="py-2 px-3 text-left">Player</th>
            <th className="py-2 px-3 text-right">Points</th>
          </tr>
        </thead>

        <tbody className="text-neutral-100">
          {sortedPlayers.map((player, index) => {
            const tinted = player.color;

            return (
              <tr
                key={index}
                className="border-t border-neutral-700 hover:brightness-110 transition"
                style={{ backgroundColor: tinted }}
              >
                <td className="py-2 px-3">{index + 1}</td>
                <td className="py-2 px-3 flex items-center gap-2">
                  <span
                    className="inline-block w-3 h-3 rounded-full"
                    style={{ backgroundColor: `${player.color}70` }}
                  />
                  {player.userName}
                </td>
                <td className="py-2 px-3 text-right font-bold">{player.points}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
    </div>
  </div>
</main>
  );
};

export default ResultRoom;