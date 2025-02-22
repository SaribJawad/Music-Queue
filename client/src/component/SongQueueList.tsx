import { BiSolidDownvote, BiSolidUpvote } from "react-icons/bi";

function SongQueueList() {
  return (
    <div className="w-full flex items-center justify-between  bg-background_light dark:bg-background_dark rounded-md p-2">
      <div>
        <h1 className="sm:text-sm text-xs">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero,
          numquam.
        </h1>
        <p className="text-xs dark:text-zinc-500 text-text_dark_secondary">
          Lorem, ipsum
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button className="dark:text-text_dark text-text_light">
          <BiSolidUpvote size={17} />
        </button>
        <span className="text-sm">0</span>
        {/* add for active !!! text-text_dark_secondary */}
        <button className="dark:text-text_dark text-text_light">
          <BiSolidDownvote size={17} />
        </button>
      </div>
    </div>
  );
}

export default SongQueueList;
