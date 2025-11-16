import { getSocket } from "../lib/socket";
import { useEffect, useState } from "react";
import { Player } from "../lib/types";
import { useRouter, useSearchParams } from 'next/navigation';

export type EndProps = {
  players: Player[];
};

const EndRoom: React.FC<EndProps> = ({
  players,
}) => {
  const sortedPlayers = [...players].sort((a, b) => b.points - a.points);
  const router = useRouter();

  //ADD SONG-PLAYING LOGIC
  return (
    <main className="flex min-h-screen items-start justify-center bg-neutral-950 relative px-6">
      {/* Center Column */}
      <div className="flex flex-col items-center gap-6">

        <h1 className="text-2xl text-white font-black">GAME FINISHED</h1>

        {/* Leaderboard table */}
        <div className="w-full max-w-md mx-auto">
          <h2 className="text-xl font-bold text-white text-center mb-2">Leaderboard</h2>

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
                const tinted = player.color;

                return (
                  <tr
                    //key={player.userName}
                    key={index}

                    className="border-t border-neutral-700 hover:brightness-110 transition"
                    style={{ backgroundColor: tinted }}
                  >
                    <td className="py-2 px-3">{index + 1}</td>

                    <td className="py-2 px-3 flex items-center gap-2">
                      <span
                        className="inline-block w-3 h-3 rounded-full"
                        style={{ backgroundColor: `${player.color}80` }}
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

        <button
            onClick={() => { router.push("/") }}
            className="flex w-full items-center justify-center rounded-full
            bg-emerald-400
            px-3 py-2 text-sm font-medium text-black transition"
          >
            New Game
          </button>

      </div>
    </main>
  );
};

export default EndRoom;