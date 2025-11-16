import { useState } from "react";
import { Curse } from "../lib/types";
import { IconProps } from "./Icon";
import Icon from "./Icon";


export type CurseIconProps = {
    key: number;
    curse: Curse;
    onClick: React.Dispatch<React.SetStateAction<number>>;
}

const CurseIcon: React.FC<CurseIconProps> = ({
    curse,
    onClick
}) => {
    const [selected, setSelected] = useState(false);

    const curseIndex = curse.curseIndex

    const iconProps: IconProps = {
        label: curse.curseName,
        initials: "C", 
        color: "#374151",
        size: 32, 
        boldText: true, 
        selected: selected,
        onClick: () => onClick(curseIndex),
    }
    return (
        <Icon {...iconProps}/>
    );
}

export default CurseIcon;
