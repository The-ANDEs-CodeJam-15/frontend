"use client"

import Image from "next/image";
import Lobby from "../components/Lobby";
import WaitingRoom from "../components/WaitingRoom";
import { getSocket } from "../lib/socket";
import { useEffect, useState } from "react";
import { LobbyProps } from "../components/Lobby";
import { WaitingRoomProps } from "../components/WaitingRoom";


export default function Home() {
  const [isLoadingHost, setLoadingHost] = useState(false);
  const [isLoadingJoin, setLoadingJoin] = useState(false);
  const [isHost, setHost] = useState(false);
  const [isStarting, setStarting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [userName, setUserName] = useState<string>("Player");
  const [inRoom, setInRoom] = useState(false);
  const [roomCode, setRoomCode] = useState("");

  const socket = getSocket();

  const handleHostRoom = async ({ userName }: { userName: string }) => {
    try {
      setErrorMessage(undefined);
      setLoadingHost(true);
      socket.emit("create_room", { userName });
      //need to retrieve a room code if the server deems request as valid
      //then, set inRoom and isHost to true
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to host room.");
    }
  };

  const handleJoinRoom = async ({ enteredCode, userName }: { enteredCode: string, userName: string }) => {
    setErrorMessage(undefined);
    setLoadingJoin(true);
    
    // Set a timeout in case server never responds
    const timeout = setTimeout(() => {
      setErrorMessage("Connection timeout");
      setLoadingJoin(false);
    }, 5000);
    
    socket.emit("join_room", { roomCode: enteredCode, username: userName });
    
    // The response will come via the "room_joined" event
    // You could also add error handling for "join_failed" event
  };

  const onRoomCreated = ({ roomCode } : { roomCode: string }) => {
    onRoomJoin({ roomCode })
    setHost(true);
    //succeful (idk how the fuck to spell that) creation: render waiting room component as host instead of lobby.tsx
  }

  const onRoomJoin = ({ roomCode } : { roomCode: string }) => {
    setRoomCode(roomCode);
    setInRoom(true);
    // suck sess full joining, i.e. correct code specified render waiting room component as joiner instead of
  }

  const onJoinError = () => {
    setErrorMessage("Room does not exist!")
    setLoadingJoin(false)
  }

  const handleStart = async () => {
    //start the match, for host only; if server deems valid, all clients will be directed to game page
  }

  useEffect(() => {
  socket.on("room_created", onRoomCreated);
  socket.on("room_joined", onRoomJoin);
  socket.on("join_error", onJoinError);
  
  return () => {
    socket.off("room_created", onRoomCreated);
    socket.off("room_joined", onRoomJoin);
  };
}, []);

  const lobbyProps: LobbyProps = {
    onHostRoom: handleHostRoom,
    onJoinRoom: handleJoinRoom,
    userName,
    setUserName,
    isLoadingHost,
    isLoadingJoin,
    errorMessage,
  };

  const waitingRoomProps: WaitingRoomProps = {
    onStart: handleStart,
    isHost,
    roomCode,
    userName,
    isStarting,
  }

  //const activePanel = inRoom ? (<WaitingRoom {...waitingRoomProps}/>) : (<Lobby {...lobbyProps} />)

  useEffect(() => {
    socket.on("room_joined", onRoomJoin);
  }, []);

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-neutral-950 overflow-hidden">
      <div className="relative w-full max-w-md">
        {/* Lobby - slides out to the left */}
        <div
          className="transition-transform duration-500 ease-in-out px-4"
          style={{
            transform: inRoom ? 'translateX(-100vw)' : 'translateX(0)',
          }}
        >
          <Lobby {...lobbyProps} />
        </div>

        {/* Waiting Room - slides in from the right */}
        <div
          className="absolute inset-0 transition-transform duration-500 ease-in-out px-4"
          style={{
            transform: inRoom ? 'translateX(0)' : 'translateX(100vw)',
          }}
        >
          <WaitingRoom {...waitingRoomProps} />
        </div>
      </div>
    </div>
  );
}
