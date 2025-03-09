import { useEffect, useRef } from "react";
import Button from "./Button";
import { SongType } from "../schemas/songSchema";
import { useWebSocketContext } from "../contexts/webSocketProvider";
import { showToast } from "../utils/showToast";
import { useAppSelector } from "../app/hook";
import { selectSongQueue } from "../features/song/song.slice";
import { useParams } from "react-router-dom";
import { FaUser } from "react-icons/fa6";
import { selectNoOfJoinedUser } from "../features/liveRoom/liveRoom.slice";

// youtube iframe api types
declare global {
  interface Window {
    YT: typeof YT;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface IYoutubeDisplaySectionProps {
  currentSong: SongType;
  isAdmin: boolean;
}

function YoutubeDisplaySection({
  currentSong,
  isAdmin,
}: IYoutubeDisplaySectionProps) {
  const playerContainer = useRef<HTMLDivElement>(null);
  const youtubePlayer = useRef<YT.Player>();
  const songsQueue = useAppSelector(selectSongQueue);
  const noOfJoinedUser = useAppSelector(selectNoOfJoinedUser);
  const { isConnected, sendMessage } = useWebSocketContext();
  const { roomId } = useParams();

  useEffect(() => {
    // loads the IFrame Player API
    if (!currentSong?.externalId) return;

    if (youtubePlayer.current) {
      youtubePlayer.current.loadVideoById(currentSong.externalId);
    } else if (!window.YT) {
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
        onStateChange: (e) => {
          console.log(e);
          console.log("onPlayerStateChange");
        },
      },
    });
  };

  const handlePlayNext = () => {
    if (songsQueue.length <= 0) {
      return showToast("error", "No songs currently in queue.");
    }
    const sent = sendMessage(
      { songId: songsQueue[0]._id, roomId },
      "PLAY_NEXT_SONG"
    );
    if (sent) {
      return;
    } else if (isConnected) {
      console.warn(
        "Failed to send message even though connection is established"
      );
    } else {
      showToast("error", "Something went wrong! Try again.");
    }
  };

  return (
    <section className=" xl:flex-1  flex flex-col gap-3">
      {/* stream buttons */}
      <div className="flex items-center justify-between">
        <div className="text-sm flex items-center gap-2 justify-center">
          <FaUser />
          <span>{noOfJoinedUser}</span>
        </div>
        {isAdmin && (
          <div className="flex items-center gap-2 justify-end">
            <Button size="sm">Sync All</Button>
            <Button size="sm">Sync To</Button>
            <Button size="sm">Hide timestamps</Button>
          </div>
        )}
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
        {isAdmin && (
          <Button onClick={handlePlayNext} size="sm" className="flex-shrink-0">
            Play next
          </Button>
        )}
      </div>
    </section>
  );
}

export default YoutubeDisplaySection;
