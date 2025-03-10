import { useEffect, useRef } from "react";
import Button from "./Button";
import { SongType } from "../schemas/songSchema";
import { useWebSocketContext } from "../contexts/webSocketProvider";
import { showToast } from "../utils/showToast";
import { useAppDispatch, useAppSelector } from "../app/hook";
import { selectSongQueue } from "../features/song/song.slice";
import { useParams } from "react-router-dom";
import { FaUser } from "react-icons/fa6";
import {
  selectNoOfJoinedUser,
  selectPlayerStatus,
  setCurrentSong,
} from "../features/liveRoom/liveRoom.slice";
import VolumeControlButton from "./VolumeControlButton";

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
  const dispatch = useAppDispatch();
  const songsQueueRef = useRef(songsQueue);
  const noOfJoinedUser = useAppSelector(selectNoOfJoinedUser);
  const playerStatus = useAppSelector(selectPlayerStatus);
  const { isConnected, sendMessage } = useWebSocketContext();
  const { roomId } = useParams();

  useEffect(() => {
    songsQueueRef.current = songsQueue;
  }, [songsQueue]);

  useEffect(() => {
    // loads the IFrame Player API
    if (!currentSong?.externalId) return;

    if (youtubePlayer.current) {
      youtubePlayer.current.loadVideoById(currentSong.externalId);
      return;
    }

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
  }, [currentSong?.externalId]);

  const initializeYoutubePlayer = () => {
    if (youtubePlayer.current || !playerContainer.current) return;

    youtubePlayer.current = new window.YT.Player(playerContainer.current!, {
      height: "100%",
      width: "100%",
      videoId: currentSong?.externalId,
      playerVars: {
        autoplay: 0,
        controls: isAdmin ? 1 : 0,
        rel: 0,
        autohide: 1,
      },
      events: {
        onReady: (e) => {
          console.log("onPlayerReady");
        },
        onStateChange: (e) => {
          const currentTime = e.target.getCurrentTime();

          if (e.data === 1 && isAdmin) {
            handlePlayVideo(currentTime);
          }

          if (e.data === 2 && isAdmin) {
            handlePauseVideo(currentTime);
          }

          if (e.data === 0) {
            handlePlayNext();
          }
        },
      },
    });
  };

  const handlePlayNext = () => {
    if (songsQueueRef.current.length <= 0) {
      dispatch(setCurrentSong(null));
      return showToast("emoji", "Add more songs in queue to play.");
    }
    const sent = sendMessage(
      { songId: songsQueueRef.current[0]._id, roomId },
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

  const handlePlayVideo = (timestamps: number) => {
    const sent = sendMessage({ timestamps, roomId }, "PLAY_VIDEO");
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

  useEffect(() => {
    if (
      youtubePlayer.current &&
      typeof youtubePlayer.current.seekTo === "function" &&
      currentSong
    ) {
      if (playerStatus.status === 1) {
        youtubePlayer.current?.seekTo(playerStatus.timestamps, true);
        youtubePlayer.current?.playVideo();
      } else if (playerStatus.status === 2) {
        youtubePlayer.current?.seekTo(playerStatus.timestamps, true);
        youtubePlayer.current?.pauseVideo();
      }
    }
  }, [playerStatus, currentSong]);

  const handlePauseVideo = (timestamps: number) => {
    const sent = sendMessage({ timestamps, roomId }, "PAUSE_VIDEO");
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
      </div>

      <div className="aspect-video xl:aspect-auto xl:h-[90%] w-full  relative">
        {!isAdmin && currentSong && (
          <div className=" absolute h-full w-full "></div>
        )}
        {!currentSong ? (
          <div className="h-full w-full flex items-center justify-center sm:text-base text-sm z-0 ">
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

        {isAdmin && currentSong ? (
          <Button onClick={handlePlayNext} size="sm" className="flex-shrink-0">
            Play next
          </Button>
        ) : (
          currentSong && (
            <VolumeControlButton youtubePlayer={youtubePlayer.current} />
          )
        )}
      </div>
    </section>
  );
}

export default YoutubeDisplaySection;
