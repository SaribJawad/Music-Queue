import { BiSolidDownvote, BiSolidUpvote } from "react-icons/bi";
import { SongType } from "../schemas/songSchema";
import { FaTrash } from "react-icons/fa6";
import { useWebSocketContext } from "../contexts/webSocketProvider";
import { useAppSelector } from "../app/hook";
import { selectLiveRoom } from "../features/liveRoom/liveRoom.slice";
import { selectUserInfo } from "../features/auth/auth.slice";
import { showToast } from "../utils/showToast";

function SongQueueList({ song }: { song: SongType }) {
  const liveRoom = useAppSelector(selectLiveRoom);
  const loggedInUser = useAppSelector(selectUserInfo);
  const { isConnected, sendMessage } = useWebSocketContext();

  const isAdmin = liveRoom?.owner._id === loggedInUser?._id;
  const isUpvoted = song.vote.some((x) => x === loggedInUser?._id);

  const handleDeleteSong = () => {
    const sent = sendMessage(
      { roomId: liveRoom?._id, songId: song._id },
      "DELETE_SONG"
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

  const handleUpVoteSong = () => {
    const sent = sendMessage(
      { roomId: liveRoom?._id, songId: song._id, userId: loggedInUser?._id },
      "UPVOTE_SONG"
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
    <div className="w-full flex items-center justify-between  bg-background_light dark:bg-background_dark rounded-md p-2 gap-2">
      <div>
        <h1 className="sm:text-sm text-xs">{song?.title}</h1>
        <p className="text-xs dark:text-zinc-500 text-text_dark_secondary">
          {song?.artist}
        </p>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0 p-2">
        <button
          onClick={handleUpVoteSong}
          className={`  ${
            isUpvoted
              ? "text-text_dark_secondary"
              : "text-zinc-400 dark:text-text_dark"
          }`}
        >
          <BiSolidUpvote size={17} />
        </button>
        <span className="text-sm">{song?.noOfVote}</span>
        {/* add for active !!! text-text_dark_secondary */}

        {isAdmin && (
          <button
            onClick={handleDeleteSong}
            className="dark:text-red-500 text-red-500"
          >
            <FaTrash size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

export default SongQueueList;
