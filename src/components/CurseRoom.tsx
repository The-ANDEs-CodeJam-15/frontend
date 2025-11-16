import { getSocket } from "../lib/socket";
import { useEffect, useState } from "react";
import FancyTimer from "./FancyTimer";
import PlayerIcon from "./PlayerIcon";
import { PlayerIconProps } from "./PlayerIcon";
import CurseIcon from "./CurseIcon";
import { CurseIconProps } from "./CurseIcon";
import { Player, Curse } from "../lib/types";

export type CurseProps = {
  players: Player[];
  curses: Curse[];
  onClickPlayer: ({ opSessionID }: { opSessionID: string }) => void
  setSelectedCurseIndex: React.Dispatch<React.SetStateAction<number>>;
};

const CurseRoom: React.FC<CurseProps> = ({
  players,
  curses,
  onClickPlayer, //For clicking on a player; curses if a curse selected
  setSelectedCurseIndex //Set state for curse index declared in page
}) => {
  const totalTime = 10;
  const [timeRemaining, setTimeRemaining] = useState(totalTime);

  // const playerIconProps: PlayerIconProps = {
  //   player,
  //   isMe?,
  //   onClick,
  // };


  /*const curseIconProps: CurseIconProps = {
    curse: curse,
    setSelectedCurseIndex,
  };*/

  const curseIconPropsArray = curses.map((curse) => ({
    // key: curse.curseIndex,
    curse: curse,
    onClick: setSelectedCurseIndex,
  }));

  const playerIconPropsArray = players.map((player) => ({
    // key: player.sessionID,                    // correct place for key
    player: player,
    isMe: false,    // or false if not needed
    onClick: onClickPlayer,
  }));

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 relative px-6">

      {/* Center Column */}
      <div className="flex flex-col items-center gap-6">
        <h2 className="text-xl text-neutral-100 font-bold">Players</h2>
        {/* Player Circles */}
        <div className="flex gap-4 relative z-30">
          {playerIconPropsArray.map((props) => (
            <PlayerIcon key={props.player.sessionID} {...props} />
          ))}

        </div>

        {/* Spacer between players and curses */}
        <div className="h-12" />

        {/* Curses */}
        <div className="flex flex-col gap-2 w-full">
          <span className="font-bold text-neutral-100 text-left w-full">Your curses:</span>
          <div className="flex gap-4">
            {curseIconPropsArray.map((props) => (
              <CurseIcon key={props.curse.curseIndex} {...props} />
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

export default CurseRoom;