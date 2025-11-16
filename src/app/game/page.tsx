"use client"

import { getSocket } from "../../lib/socket";
import { useEffect, useState } from "react";
import FancyTimer from "@/src/components/FancyTimer";

export default function Game() {
    const loading = 0;
    const initialCountdown = 1;
    const curseSequence = 2;
    const guessingSequence = 3;
    const resultsSequence = 4;

    const [roundType, setRoundType] = useState(0)
    const [totalTime, setTotalTime] = useState(0)
    const [timeRemaining, setTimeRemaining] = useState(0)

    const socket = getSocket();
    //const [waiting, setWaiting] = useState(true)
    const [gameState, setGameState] = useState(loading)

    const onInitialCountdown = () => {
        //from loading to intitial countdown
        console.log("Initial countdown starting!")
        setGameState(initialCountdown)
    }

    const onTimerUpdate = ({ timeRemaining, totalTime } : { timeRemaining: number, totalTime: number }) => {
        console.log("got time remaining:", timeRemaining, " and total time: ", totalTime);
        setTotalTime(totalTime); //MOVE LATER SO WE ARE NOT SETTING STATE EVERY TIME
        setTimeRemaining(timeRemaining);
    }
    

    useEffect(() => {
        socket.emit("ready_status", {});
        socket.on("initial_countdown", onInitialCountdown);
        socket.on("timer_update", onTimerUpdate);
        return () => {
            socket.off("initial_countdown", onInitialCountdown);
            socket.off("timer_update", onTimerUpdate);
        }
    }, [])

    const timerProps = {
        timeRemaining,
        totalTime,
    }
    

    return (
        <div>
            {
                (gameState == loading) && <h1>LOADING...</h1>
            }
            {
                (gameState != loading) &&  (
                <div>
                    <h1>{roundType}</h1>
                    <h1>{timeRemaining}</h1>
                    <FancyTimer {...timerProps}/>
                </div>
                )
                
            }
            

        </div>
    )

}