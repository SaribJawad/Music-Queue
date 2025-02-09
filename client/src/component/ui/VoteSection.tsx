import { IoMusicalNotes } from "react-icons/io5";
import { FaArrowDownLong, FaArrowUpLong } from "react-icons/fa6";

function VoteSection() {
  const initialSongs = [
    {
      id: 1,
      title: "Blinding Lights",
      artist: "The Weeknd",
      upvotes: 45,
      downvotes: 5,
      duration: "3:20",
      videoId: "4NRXx6U8ABQ",
    },
    {
      id: 2,
      title: "Dance Monkey",
      artist: "Tones and I",
      upvotes: 32,
      downvotes: 8,
      duration: "3:29",
      videoId: "q0hyYWKXF0Q",
    },
    {
      id: 3,
      title: "Watermelon Sugar",
      artist: "Harry Styles",
      upvotes: 28,
      downvotes: 3,
      duration: "2:54",
      videoId: "E07s5ZYygMg",
    },
    {
      id: 4,
      title: "Don't Start Now",
      artist: "Dua Lipa",
      upvotes: 20,
      downvotes: 2,
      duration: "3:03",
      videoId: "oygrmJFKYZY",
    },
    {
      id: 5,
      title: "Circles",
      artist: "Post Malone",
      upvotes: 18,
      downvotes: 1,
      duration: "3:35",
      videoId: "wXhTHyIgQ_U",
    },
  ];

  return (
    <div className=" bg-background_light_secondary dark:bg-background_dark_secondary flex flex-col gap-5 p-4 rounded-md  overflow-y-auto   ">
      <h1 className="text-lg font-semibold dark:text-white text-background_dark ">
        Voting Progress
      </h1>
      {initialSongs.map((song) => (
        <div
          key={song.id}
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
            <span className="text-white text-sm">10</span>
            <button>
              <FaArrowDownLong />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default VoteSection;
