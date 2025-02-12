import { useState } from "react";
import { ISong } from "../../types/types";
import Button from "../Button";
import { useSongContext } from "../../contexts/songContext";
import { useParams } from "react-router-dom";
import LoadingBar from "./LoadingBar";
import YouTube from "react-youtube";

interface NowPlayingSectionProps {
  currentSong: ISong | null;
  isOwner: boolean;
}

function NowPlayingSection({ currentSong, isOwner }: NowPlayingSectionProps) {
  const [input, setInput] = useState<string>("");
  const { streamId } = useParams();
  const { addSong, isAddSongLoading, playNext } = useSongContext();

  const handleAddSong = (input: string) => {
    addSong(streamId!, input);
  };

  const handlePlayNext = (streamId: string) => {
    playNext(streamId);
  };

  // TODOO
  const opts = {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 1 as 0 | 1,
      // controls: isOwner ? (1 as 0 | 1) : (0 as 0 | 1), // Allow controls only for the owner
      // disablekb: isOwner ? (0 as 0 | 1) : (1 as 0 | 1), // Disable keyboard controls for viewers
      // modestbranding: 1 as 1, // Removes YouTube logo
      rel: 0 as 0 | 1, // Prevents showing related videos at the end
    },
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
            {/* handle with websockets  */}
            {/*onReady={func}                    // defaults -> noop
              onPlay={func}                     // defaults -> noop
              onPause={func}                    // defaults -> noop
              onEnd={func}
           */}

            <YouTube
              videoId={currentSong.externalId}
              opts={opts}
              className="h-[90%] w-full"
            />
            <div className="flex items-center justify-between w-full">
              <h3 className="dark:text-text_dark text-text_light flex flex-col">
                {currentSong?.title}
                <span className="dark:text-zinc-500 text-background_dark_secondary text-sm">
                  {currentSong.artist}
                </span>
              </h3>
              {isOwner && (
                <Button
                  onClick={() => handlePlayNext(streamId!)}
                  isDisable={isAddSongLoading}
                  size="sm"
                >
                  Play Next
                </Button>
              )}
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
          disabled={isAddSongLoading}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          type="text"
          placeholder="Paste YouTube URL here"
          className="dark:bg-background_dark bg-background_light px-2 rounded-md outline-none flex-grow placeholder:text-sm placeholder:text-text_light dark:placeholder:text-white  dark:text-white text-text_light text-sm"
        />
        <Button
          isDisable={isAddSongLoading || input.length <= 0}
          onClick={() => handleAddSong(input)}
          size="sm"
        >
          {isAddSongLoading ? <LoadingBar size="sm" /> : "Add Song"}
        </Button>
      </div>
    </div>
  );
}

export default NowPlayingSection;
