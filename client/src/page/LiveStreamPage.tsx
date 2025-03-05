import { useEffect } from "react";
import { useAppSelector } from "../app/hook";
import Navbar from "../component/Navbar";
import SongQueueDisplaySection from "../component/SongQueueDisplaySection";
import LoadingBar from "../component/ui/LoadingBar";
import YoutubeDisplaySection from "../component/YoutubeDisplaySection";
import { useGetLiveRoom } from "../customHooks/useGetLiveRoom";
import { selectLiveRoom } from "../features/liveRoom/liveRoom.slice";
import { useWebSocketContext } from "../contexts/webSocketProvider";
import { useParams } from "react-router-dom";
import { showToast } from "../utils/showToast";

function LiveRoomPage() {
  const { isLoading } = useGetLiveRoom();
  const liveRoom = useAppSelector(selectLiveRoom);
  const { roomId } = useParams();
  const { isConnected, sendMessage } = useWebSocketContext();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isConnected && roomId) {
        const sent = sendMessage({ roomId }, "REFRESH_JOIN_ROOM");
        if (sent) {
          console.log("Refreshed join room", { isConnected, roomId });
        } else {
          console.warn("Failed to send message");
          showToast("error", "Connection issue. Please try again.");
        }
      }
    }, 500);

    // Cleanup function
    return () => clearTimeout(timer);
  }, [isConnected, roomId]);

  if (isLoading) {
    return (
      <div className="h-dvh w-full flex items-center justify-center dark:bg-background_dark bg-background_light ">
        <LoadingBar />
      </div>
    );
  }
  return (
    <main className="min-h-dvh flex flex-col w-full bg-background_light dark:bg-background_dark text-text_light dark:text-text_dark  sm:px-5 sm:py-5 py-2 px-2">
      <Navbar variant="stream" username={liveRoom?.owner.name} />
      <section className="flex-1 rounded-md xl:flex-row flex-col dark:bg-background_dark_secondary bg-background_light_secondary sm:p-5 p-3 flex gap-3">
        <YoutubeDisplaySection currentSong={liveRoom?.currentSong!} />
        <span className="xl:w-[1px] w-full xl:h-auto h-[1px]  dark:bg-text_dark bg-text_light"></span>
        <SongQueueDisplaySection />
      </section>
    </main>
  );
}

export default LiveRoomPage;
