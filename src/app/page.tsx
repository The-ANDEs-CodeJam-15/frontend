"use client"

import Image from "next/image";
import Lobby from "../components/Lobby";
import { getSocket } from "../lib/socket";
import { useEffect, useState } from "react";
import { LobbyProps } from "../components/Lobby";


export default function Home() {
  const [isLoadingHost, setLoadingHost] = useState(false);
  const [isLoadingJoin, setLoadingJoin] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const socket = getSocket();
  
  const handleHostRoom = async ({ roomName }: { roomName?: string }) => {
    try {
      setErrorMessage(undefined);
      setLoadingHost(true);
      socket.emit("hostRoom", { roomName });
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to host room.");
    } finally {
      setLoadingHost(false);
    }
  };

  const handleJoinRoom = async ({ roomCode }: { roomCode: string }) => {
    try {
      setErrorMessage(undefined);
      setLoadingJoin(true);
      socket.emit("joinRoom", { roomCode });
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to join room.");
    } finally {
      setLoadingJoin(false);
    }
  };

  const lobbyProps: LobbyProps = {
    onHostRoom: handleHostRoom,
    onJoinRoom: handleJoinRoom,
    isLoadingHost,
    isLoadingJoin,
    errorMessage,
  };

  useEffect(() => {
    const socket = getSocket();
  }, []);

  return (
    <div>
      <Lobby {...lobbyProps} />
    </div>
  );
}
