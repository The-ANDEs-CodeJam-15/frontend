import Icon from "./Icon";
import { IconProps } from "./Icon";
import { useState } from "react";
import { Player } from "../lib/types";


export type PlayerIconProps = {
    // key: string;
    player: Player;
    isMe?: boolean;
    onClick: ( { opSessionID }: { opSessionID: string }) => void;
}

const getInitials = (name: string) => {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
};

const PlayerIcon: React.FC<PlayerIconProps> = ({
    player,
    isMe = false,
    onClick
}) => {
    const sessionID = player.sessionID;
    const [selected, setSelected] = useState(false);

    const opSessionID = player.sessionID

    const iconProps: IconProps = {
        label: player.userName, 
        initials: getInitials(player.userName), 
        value: player.points, 
        color: player.color,
        size: 48, 
        boldText: isMe,
        selected: selected,
        onClick: () => onClick({ opSessionID }),
    }
    return (
        <div
            onMouseEnter={() => setSelected(true)}
            onMouseLeave={() => setSelected(false)}>
            <Icon {...iconProps}/>
        </div>
    )

    // <div>
    //     <button
    //         //         className={`flex flex-col items-center gap-1 transition 
    //         //     ${selectedCurseIndex ? "cursor-pointer hover:scale-105" : "cursor-default"} 
    //         //   `}
    //         className="flex flex-col items-center gap-1 transition cursor-pointer hover:scale-105"
    //         key={userName}
    //         // disabled={!selectedCurseIndex}
    //         onClick={(e) => {
    //             // e.stopPropagation();        // so it doesn’t dismiss selection
    //             // if (selectedCurseIndex) {
    //             //     selectedCurseIndex.effectFunction(player);
    //             //     setSelectedCurseIndex(null);
    //             }
    //         }



    //     >
    //         <div
    //             //         className={`flex items-center justify-center w-16 h-16 rounded-full text-white font-bold border-2 
    //             //   ${selectedCurseIndex ? "border-white" : "border-white/50"} 
    //             //   shadow-[0_0_4px_2px_white]
    //             // `}
    //             className="flex items-center justify-center w-16 h-16 rounded-full text-white font-bold border-2 
    //     border-white/50 shadow-[0_0_4px_2px_white]"
    //             style={{ backgroundColor: color }}
    //         >
    //             {userName}
    //         </div>


    //     </button>

    //     <span className="text-xs text-neutral-300">{points} pts</span>
    // </div>

}

export default PlayerIcon