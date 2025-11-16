import React from "react";
import { useState } from "react";
import { Song } from "@/src/lib/types";

export type SongSearchProps = {
    entry: string;
    setEntry: (value: string) => void;
    dropDownData: Song[];
    onSelectSong: (song: Song) => void;
    onSubmitSong: (song?: Song) => void;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isBlocked: boolean;
    setIsBlocked: any;
    placeholder?: string;
};

const SongSearch: React.FC<SongSearchProps> = ({
    entry,
    setEntry,
    dropDownData,
    onSelectSong,
    onSubmitSong,
    handleChange,
    isBlocked,
    setIsBlocked,
    placeholder = "Search for a song...",
}) => {
    const [selectedSong, setSelectedSong] = useState<Song | undefined>(undefined);

    const select = (song: Song) => {
        setSelectedSong(song);
        onSelectSong(song)
    }

    const submit = () => {
        setIsBlocked(true);
        onSubmitSong(selectedSong)
    }
    return (
        <div className="w-full max-w-md relative">
            <div className="flex items-start">
                {/* Input + Dropdown wrapper */}
                <div className="relative flex-1">
                    {/* Search Input */}
                    <input
                        type="text"
                        placeholder={placeholder}
                        value={entry}
                        onChange={(e) => handleChange(e)}
                        className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-neutral-100 outline-none ring-0 transition placeholder:text-neutral-500 focus:border-emerald-500"
                    />

                    {/* Dropdown */}
                    {dropDownData.length > 0 && (
                        <div className="absolute mt-2 w-full bg-neutral-900 rounded-xl shadow-xl border border-neutral-700 max-h-80 overflow-y-auto z-50">
                            {dropDownData.map((song) => (
                                <div
                                    key={song.trackID}
                                    onClick={() => select(song)}
                                    className="px-4 py-3 cursor-pointer hover:bg-neutral-800 transition border-b border-neutral-800 last:border-b-0"
                                >
                                    <div className="text-neutral-50 font-medium text-sm">
                                        {song.name}
                                    </div>
                                    <div className="text-neutral-400 text-xs">
                                        {song.artist}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <button
                    onClick={() => submit()}
                    disabled={entry == "" || isBlocked}
                    className="ml-2 items-center justify-center rounded-xl
            bg-white
            px-3 py-2 text-sm font-medium text-black transition disabled:cursor-not-allowed disabled:opacity-60"
                >
                    SUBMIT
                </button>
            </div>
        </div >
    );
};

export default SongSearch;