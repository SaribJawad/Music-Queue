import { useAppSelector } from "../app/hook";
import { useGetSongQueue } from "../customHooks/useGetSongQueue";
import { selectSongQueue } from "../features/song/song.slice";
import AddSongSection from "./AddSongSection";
import SongQueueList from "./SongQueueList";
import LoadingBar from "./ui/LoadingBar";

function SongQueueDisplaySection() {
  const { isLoading } = useGetSongQueue();
  const songQueue = useAppSelector(selectSongQueue);

  return (
    <section className="xl:w-[400px] w-full flex flex-col gap-4 xl:min-h-[calc(100vh-144px)] ">
      <h1 className="font-semibold text-center flex-shrink-0">
        Song/Video Queue
      </h1>
      {isLoading ? (
        <div className="h-full w-full flex items-center justify-center">
          <LoadingBar />
        </div>
      ) : (
        <>
          <AddSongSection />
          <section className="flex-1 min-h-0 overflow-y-auto ">
            <div className="flex flex-col gap-3 xl:max-h-[0px] max-h-[400px]">
              {songQueue &&
                songQueue.map((song) => (
                  <SongQueueList key={song._id} song={song} />
                ))}
            </div>
          </section>
        </>
      )}
    </section>
  );
}

export default SongQueueDisplaySection;
