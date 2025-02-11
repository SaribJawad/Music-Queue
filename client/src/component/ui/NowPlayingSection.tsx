import { useState } from "react";
import { ISong } from "../../types/types";
import Button from "../Button";
import { useSongContext } from "../../contexts/songContext";

interface NowPlayingSectionProps {
  currentSong: ISong | null;
  isOwner: boolean;
}

function NowPlayingSection({ currentSong, isOwner }: NowPlayingSectionProps) {
  const [input, setInput] = useState<string>("");
  const { addSong } = useSongContext();

  const handleAddSong = (input: string) => {
    addSong(input);
  };

  return (
    <div className="lg:col-span-2 bg-background_light_secondary dark:bg-background_dark_secondary p-4 rounded-md  flex flex-col gap-2">
      <div className="flex justify-between">
        <h1 className="text-lg font-semibold dark:text-white text-background_dark ">
          Now Playing
        </h1>
        {isOwner && <Button size="sm">End stream</Button>}
      </div>
      <div className="aspect-video  flex flex-col items-center justify-center  gap-2">
        {currentSong ? (
          <>
            <iframe
              width="100%"
              height="90%"
              // fix
              src={currentSong?.externalId}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <div className="flex items-center justify-between">
              <h3 className="dark:text-text_dark text-text_light flex flex-col">
                {currentSong?.title}
                <span className="dark:text-zinc-500 text-background_dark_secondary text-sm">
                  {""}
                </span>
              </h3>
              {isOwner && <Button size="sm">Play Next</Button>}
            </div>
          </>
        ) : (
          <h1 className="dark:text-white text-text_light">
            No song playing right now
          </h1>
        )}
      </div>
      <div className="flex  gap-2 ">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          type="text"
          placeholder="Paste YouTube URL here"
          className="dark:bg-background_dark bg-background_light px-2 rounded-md outline-none flex-grow placeholder:text-sm placeholder:text-text_light dark:placeholder:text-white  dark:text-white text-text_light text-sm"
        />
        <Button onClick={() => handleAddSong(input)} size="sm">
          Add Song
        </Button>
      </div>
    </div>
  );
}

export default NowPlayingSection;
