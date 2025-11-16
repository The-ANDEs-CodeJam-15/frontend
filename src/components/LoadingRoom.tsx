import { getSocket } from "../lib/socket";
import { useEffect, useState } from "react";


export type LoadingProps = {
};

const LoadingRoom: React.FC<LoadingProps> = ({

}) => {


    return (
        <main className="flex min-h-screen items-center justify-center bg-neutral-950 relative px-6">
            <h1 className="text-2xl text-white font-black">Loading...</h1>

        </main>
    );
};

export default LoadingRoom;