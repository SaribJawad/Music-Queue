import { IoMusicalNotes } from "react-icons/io5";
import { FaArrowDownLong, FaArrowUpLong } from "react-icons/fa6";
import { useSongContext } from "../../contexts/songContext";
import { useParams } from "react-router-dom";
import { useAuthContext } from "../../contexts/authContext";
import { useEffect } from "react";

function VoteSection() {
  const { upVoteSong, downVoteSong, songQueue, getSongQueue } =
    useSongContext();
  const { userInfo } = useAuthContext();
  const { streamId } = useParams();

  const handleUpVote = (songId: string, streamId: string) => {
    upVoteSong(songId, streamId);
  };

  const handleDownVote = (songId: string, streamId: string) => {
    downVoteSong(songId, streamId);
  };

  useEffect(() => {
    getSongQueue(streamId!);
  }, []);

  return (
    <div className=" bg-background_light_secondary dark:bg-background_dark_secondary flex flex-col gap-5 p-4 rounded-md  overflow-y-auto   ">
      <h1 className="text-lg font-semibold dark:text-white text-background_dark ">
        Voting Progress
      </h1>

      <div className="flex flex-col gap-3">
        {songQueue?.length <= 0 ? (
          <h1 className="text-center dark:text-white text-text_light">
            No songs in the queue right now
          </h1>
        ) : (
          songQueue?.map((song) => (
            <div
              key={song._id}
              className="dark:bg-background_dark bg-background_light dark:text-text_dark  px-3 py-2 rounded-md flex justify-between"
            >
              <div className="flex items-center gap-3">
                <IoMusicalNotes size={20} />
                <h3 className="dark:text-white text-background_dark flex flex-col">
                  {song.title}{" "}
                  <span className="text-sm text-zinc-500">{song.artist}</span>
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <button
                  className={`${
                    song.vote.includes(userInfo?._id!) && "cursor-not-allowed"
                  }`}
                  disabled={song.vote.includes(userInfo?._id!)}
                  onClick={() => handleUpVote(song._id, streamId!)}
                >
                  <FaArrowUpLong />
                </button>
                <span className="text-white text-sm">{song.noOfVote}</span>
                <button
                  className={`${
                    !song.vote.includes(userInfo?._id!) && "cursor-not-allowed"
                  }`}
                  disabled={!song.vote.includes(userInfo?._id!)}
                  onClick={() => handleDownVote(song._id, streamId!)}
                >
                  <FaArrowDownLong />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default VoteSection;
