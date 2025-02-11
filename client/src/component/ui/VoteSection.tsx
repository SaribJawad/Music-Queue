import { IoMusicalNotes } from "react-icons/io5";
import { FaArrowDownLong, FaArrowUpLong } from "react-icons/fa6";
import { ISong } from "../../types/types";

interface VoteSectionProps {
  songQueue: ISong[];
}

function VoteSection({ songQueue }: VoteSectionProps) {
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
                <button>
                  <FaArrowUpLong />
                </button>
                <span className="text-white text-sm">{song.noOFVote}</span>
                <button>
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
