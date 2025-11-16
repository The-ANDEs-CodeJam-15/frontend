"use client"

import { getSocket } from "../../lib/socket";
import { useEffect, useState, useRef } from "react";
import FancyTimer from "@/src/components/FancyTimer";
import CurseRoom from "../../components/CurseRoom";
import GuessRoom from "../../components/GuessRoom";
import ResultRoom from "../../components/ResultRoom";
import LoadingRoom from "../../components/LoadingRoom";
import EndRoom from "../../components/EndRoom";
import { CurseProps } from "../../components/CurseRoom";
import { Curse, Player } from "@/src/lib/types";
import { ResultProps } from "../../components/ResultRoom";
import { Song } from "@/src/lib/types";
import { GuessProps } from "../../components/GuessRoom";
import { EndProps } from "../../components/EndRoom";


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
    const end = 5;

    let appliedCurses: string[] = []

    const [totalTime, setTotalTime] = useState(0)
    const [currentRound, setCurrentRound] = useState(0);
    const [totalRounds, setTotalRounds] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(0)
    const [currentSong, setCurrentSong] = useState<Song | undefined>(undefined);
    const [currentSongAudio, setCurrentSongAudio] = useState(null);
    const [players, setPlayers] = useState<Player[]>([]);
    const [selectedCurseIndex, setSelectedCurseIndex] = useState(-1);
    const [gameState, setGameState] = useState(loading)
    const [curses, setCurses] = useState<Curse[]>([])
    const [canCurse, setCanCurse] = useState(true);
    const [entry, setEntry] = useState("");
    const [dropDownData, setdropDownData] = useState<Song[]>([]);
    const [isBlocked, setIsBlocked] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [guessed, setGuessed] = useState(false);
    const [newCurses, setNewCurses] = useState(0);

    const debounceTimer = useRef<NodeJS.Timeout | null>(null);

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
        setCanCurse(false);
    }

    const onClickPlayer = ({ opSessionID }: { opSessionID: string }) => {
        if (selectedCurseIndex >= 0 && curses.length > 0) {
            doCurse({ opSessionID })
        }
    }

    const onInitialCountdown = ({ players, totalRounds }: { players: Player[], totalRounds: number }) => {
        console.log("Setting players")
        setPlayers(players);
        setTotalRounds(totalRounds)
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
        setCanCurse(true);
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
                    console.log("AudioEngine ready for curses");
                }
            };
        }
    }

    const onSetCurseInventory = ({ curses }: { curses: Curse[] }) => {
        setSelectedCurseIndex(-1)
        setCurses(curses);
        setCanCurse(true);
    }

    const onGuessingStarted = () => {
        setIsBlocked(false);
        setIsCorrect(false);
        setGuessed(false);
        setNewCurses(0);
        
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

    const onResultsStarted = ({ song, players }: { song: Song, players: Player[] }) => {
        setPlayers(players);
        appliedCurses = [];
        setCurrentSong(song)
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

    //cooldown and filtering (PROBABLY DOESN'T WORK)
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEntry(value);

        if (value.length > 0) {
            socket.emit("get_dropdown_options", { entry: value });
        } else {
            setdropDownData([]);
        }

        // // Clear previous timer
        // if (debounceTimer.current) {
        //     clearTimeout(debounceTimer.current);
        // }

        // // Set a new timer
        // debounceTimer.current = setTimeout(() => {

        // }, 1000);
    };

    const onActivateDropdown = ({ dropDownData }: { dropDownData: Song[] }) => {
        setdropDownData(dropDownData);
    }

    const onSelectSong = (song: Song) => {
        setdropDownData([]);
        const newEntry = song.name + " - " + song.artist;
        setEntry(newEntry);
    };

    const onSubmitSong = (song?: Song) => {
        if (!song){
            setIsBlocked(false)
            return
        }
        console.log("Submitting", song.trackID)
        socket.emit("submit_guess", { song })
    }

    const onCorrectGuess = ({ newCurses }: { newCurses: number}) => {
        setIsBlocked(true);
        setIsCorrect(true);
        setGuessed(true);
        setNewCurses(newCurses);
    }
    
    const onIncorrectGuess = () => {
        setIsBlocked(false);
        setIsCorrect(false);
        setGuessed(true);
    }

    const onUpdateRound = ({ currentRound }: { currentRound: number }) => {
        setCurrentRound(currentRound)
    }

    const onEndGame = ({ players }: { players: Player[] }) => {
        setPlayers(players);
        setGameState(end);
    }

    useEffect(() => {
        socket.emit("ready_status", {});
        socket.on("initial_countdown", onInitialCountdown);
        socket.on("timer_update", onTimerUpdate);
        socket.on("cursing_started", onCursingStarted);
        socket.on("set_curse_inventory", onSetCurseInventory);
        socket.on("guessing_started", onGuessingStarted);
        socket.on("results_started", onResultsStarted);
        socket.on("apply_curse", onApplyCurse);
        socket.on("activate_dropdown", onActivateDropdown);
        socket.on("correct_guess", onCorrectGuess);
        socket.on("incorrect_guess", onIncorrectGuess);
        socket.on("update_round", onUpdateRound)
        socket.on("end_game", onEndGame)


        return () => {
            socket.off("initial_countdown", onInitialCountdown);
            socket.off("timer_update", onTimerUpdate);
            socket.off("cursing_started", onCursingStarted);
            socket.off("set_curse_inventory", onSetCurseInventory);
            socket.off("guessing_started", onGuessingStarted);
            socket.off("results_started", onResultsStarted);
            socket.off("apply_curse", onApplyCurse);
            socket.off("activate_dropdown", onActivateDropdown);
            socket.off("correct_guess", onCorrectGuess);
            socket.off("incorrect_guess", onIncorrectGuess);
            socket.off("update_round", onUpdateRound)
            socket.off("end_game", onEndGame)


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
        selectedCurseIndex,
        setSelectedCurseIndex
    }

    const guessProps: GuessProps = {
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
    }

    const resultProps: ResultProps = {
        song: currentSong,
        players,
    }
    
    const endProps: EndProps = {
        players,
    }

    return (
        <div>
            <audio ref={audioRef} className="hidden" crossOrigin="anonymous" />
            {(gameState == loading) && (
                <LoadingRoom />
            )}
            {
                (gameState != loading) && (
                    <div className="min-h-screen bg-black">
                        {/* <h1>Round Type: {gameState}</h1>
                        <h1>Time: {timeRemaining}</h1> */}
                        <div className="w-full bg-black p-4 flex items-center justify-center">
                            <FancyTimer timeRemaining={timeRemaining} totalTime={totalTime} currentRound={currentRound} totalRounds={totalRounds} />
                        </div>

                        {/* Debug info */}
                        {/* <div className="mt-4 text-sm">
                            <p>Audio loaded: {currentSongAudio ? 'Yes' : 'No'}</p>
                            <p>Audio playing: {audioRef.current && !audioRef.current.paused ? 'Yes' : 'No'}</p>
                        </div> */}

                        {/* {gameState == loading && (
                            <LoadingRoom />
                        )} */}
                        {gameState == curseSequence && (
                            <CurseRoom {...curseProps} />
                        )}
                        {gameState == guessingSequence && (
                            <GuessRoom {...guessProps} />
                        )}
                        {gameState == resultsSequence && (
                            <ResultRoom {...resultProps} />
                        )}
                        {gameState == end && (
                            <EndRoom {...endProps} />
                        )}

                    </div>
                )
            }
        </div>
    )
}