import { useEffect, useRef } from "react";
import Button from "./Button";
import { SongType } from "../schemas/songSchema";

// youtube iframe api types
declare global {
  interface Window {
    YT: typeof YT;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface IYoutubeDisplaySectionProps {
  currentSong: SongType;
}

function YoutubeDisplaySection({ currentSong }: IYoutubeDisplaySectionProps) {
  const playerContainer = useRef<HTMLDivElement>(null);
  const youtubePlayer = useRef<YT.Player>();

  useEffect(() => {
    // loads the IFrame Player API
    if (!currentSong?.externalId) return;

    if (!window.YT) {
      if (document.getElementById("youtube-iframe-script")) return;
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      tag.id = "youtube-iframe-script";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        initializeYoutubePlayer();
      };
    } else {
      initializeYoutubePlayer();
    }
  }, [currentSong]);

  const initializeYoutubePlayer = () => {
    if (youtubePlayer.current || !playerContainer.current) return;

    youtubePlayer.current = new window.YT.Player(playerContainer.current!, {
      height: "100%",
      width: "100%",
      videoId: currentSong?.externalId,
      playerVars: {
        autoplay: 1,
        controls: 1,
      },
      events: {
        onReady: () => {
          console.log("onPlayerReady");
        },
        onStateChange: () => {
          console.log("onPlayerStateChange");
        },
      },
    });
  };

  return (
    <section className=" xl:flex-1  flex flex-col gap-3">
      {/* stream buttons */}
      <div className="flex items-center gap-2 justify-end">
        <Button size="sm">Sync All</Button>
        <Button size="sm">Sync To</Button>
        <Button size="sm">Hide timestamps</Button>
      </div>
      <div className="aspect-video xl:aspect-auto xl:h-[90%] w-full">
        {!currentSong ? (
          <div className="h-full w-full flex items-center justify-center sm:text-base text-sm">
            No current song playing right now, Add songs to play!
          </div>
        ) : (
          <div
            ref={playerContainer}
            id="video-container "
            className="w-full h-full"
          ></div>
        )}
      </div>

      <div className="flex items-center justify-between  h-fit">
        <div className="">
          <h1 className="md:text-base text-sm">{currentSong?.title}</h1>
          <span className="md:text-sm text-xs text-text_dark_secondary dark:text-zinc-500">
            {currentSong?.artist}
          </span>
        </div>
        <Button size="sm" className="flex-shrink-0">
          Play next
        </Button>
      </div>
    </section>
  );
}

export default YoutubeDisplaySection;
