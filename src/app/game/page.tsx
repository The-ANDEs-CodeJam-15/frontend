"use client"

import { getSocket } from "../../lib/socket";
import { useEffect, useState, useRef } from "react";
import FancyTimer from "@/src/components/FancyTimer";
import CurseRoom from "../../components/CurseRoom";
import GuessRoom from "../../components/GuessRoom";
import ResultRoom from "../../components/ResultRoom";
import { CurseProps } from "../../components/CurseRoom";
import { Curse, Player } from "@/src/lib/types";


export default function Game() {
    /* 
    players = [ 
    { 
        sessionID: XXX,
        username: XXX
        color 
        
    }, ... ] 
    */

    const loading = 0;
    const initialCountdown = 1;
    const curseSequence = 2;
    const guessingSequence = 3;
    const resultsSequence = 4;

    const appliedCurses: string[] = []

    const [totalTime, setTotalTime] = useState(0)
    const [timeRemaining, setTimeRemaining] = useState(0)
    const [currentSong, setCurrentSong] = useState(null);
    const [currentSongAudio, setCurrentSongAudio] = useState(null);
    const [players, setPlayers] = useState<Player[]>([]);
    const [selectedCurseIndex, setSelectedCurseIndex] = useState(-1);
    const [gameState, setGameState] = useState(loading)
    const [curses, setCurses] = useState<Curse[]>([])

    //audio + AudioEngine references
    const audioRef = useRef<HTMLAudioElement>(null);
    const engineRef = useRef<any>(null);
    const socket = getSocket();

    // Initialize AudioEngine
    useEffect(() => {
        import('../../lib/AudioEngine').then((module) => {
            if (audioRef.current && !engineRef.current) {
                engineRef.current = new module.default(audioRef.current);
                console.log("AudioEngine initialized!");
            }
        });
    }, []);

    const doCurse = ({ opSessionID }: { opSessionID: string }) => {
        socket.emit("curse_player", { opSessionID, selectedCurseIndex })
    }

    const onClickPlayer = ({ opSessionID }: { opSessionID: string }) => {
        if (selectedCurseIndex >= 0) {
            doCurse({ opSessionID })
        }
    }

    const onInitialCountdown = ({ players }: { players: Player[] }) => {
        console.log("Setting players")
        setPlayers(players);
        console.log("Initial countdown starting!")
        setGameState(initialCountdown)
    }

    const onTimerUpdate = ({ timeRemaining, totalTime }: { timeRemaining: number, totalTime: number }) => {
        console.log("got time remaining:", timeRemaining, " and total time: ", totalTime);
        setTotalTime(totalTime);
        setTimeRemaining(timeRemaining);
    }

    const onCursingStarted = ({ currentSongAudio, curses }: { currentSongAudio: any, curses: Curse[] }) => {
        setSelectedCurseIndex(-1)
        console.log("Curse sequence starting, received song data");
        setCurrentSongAudio(currentSongAudio);
        setCurses(curses);
        setGameState(curseSequence);

        if (currentSongAudio && audioRef.current) {
            console.log("Setting audio source to base64 data");
            audioRef.current.src = currentSongAudio;
            audioRef.current.load();

            // Initialize AudioEngine context when audio loads
            audioRef.current.onloadeddata = () => {
                console.log("Audio loaded, initializing AudioEngine context");
                if (engineRef.current) {
                    engineRef.current._ensureContext(); // Force context creation
                    console.log("AudioEngine ready for curses!");
                }
            };
        }
    }

    const onGuessingStarted = () => {
        console.log("Guessing sequence starting");
        setGameState(guessingSequence);

        //apply current curses
        if (engineRef.current) {
            for (let i = 0; i < appliedCurses.length; i++) {
                engineRef.current.applyCurse(appliedCurses[i]);
            }
        }

        // Play audio
        if (audioRef.current) {
            audioRef.current.play()
                .then(() => console.log("Audio playing with curse"))
                .catch(err => console.error("Error playing audio:", err));
        }
    }

    const onResultsStarted = () => {
        console.log("Results sequence starting");
        setGameState(resultsSequence);

        if (engineRef.current) {
            engineRef.current.clearCurses();
        }
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    }

    const onApplyCurse = ({ curseToApply }: { curseToApply: string }) => {
        appliedCurses.push(curseToApply);
    }

    useEffect(() => {
        socket.emit("ready_status", {});
        socket.on("initial_countdown", onInitialCountdown);
        socket.on("timer_update", onTimerUpdate);
        socket.on("cursing_started", onCursingStarted);
        socket.on("guessing_started", onGuessingStarted);
        socket.on("results_started", onResultsStarted);
        socket.on("apply_curse", onApplyCurse);

        return () => {
            socket.off("initial_countdown", onInitialCountdown);
            socket.off("timer_update", onTimerUpdate);
            socket.off("cursing_started", onCursingStarted);
            socket.off("guessing_started", onGuessingStarted);
            socket.off("results_started", onResultsStarted);
            socket.off("apply_curse", onApplyCurse);
        }
    }, [])

    const timerProps = {
        timeRemaining,
        totalTime,
    }

    const curseProps: CurseProps = {
        players,
        curses,
        onClickPlayer,
        setSelectedCurseIndex
    }

    return (
        <div>
            <audio ref={audioRef} className="hidden" crossOrigin="anonymous" />
            {
                (gameState == loading) && <h1>LOADING...</h1>
            }
            {
                (gameState != loading) && (
                    <div>
                        <h1>Round Type: {gameState}</h1>
                        <h1>Time: {timeRemaining}</h1>
                        <FancyTimer {...timerProps} />

                        {/* Debug info */}
                        <div className="mt-4 text-sm">
                            <p>Audio loaded: {currentSongAudio ? 'Yes' : 'No'}</p>
                            <p>Audio playing: {audioRef.current && !audioRef.current.paused ? 'Yes' : 'No'}</p>
                        </div>

                        {gameState == curseSequence && (
                            <CurseRoom {...curseProps} />
                        )}
                        {gameState == guessingSequence && (
                            <GuessRoom />
                        )}
                        {/* {gameState == resultsSequence && (
                            <ResultRoom
                            {guess: Song,
                            song: Song,
                            players: players,}
                            />
                        )} */}

                    </div>
                )
            }
        </div>
    )
}