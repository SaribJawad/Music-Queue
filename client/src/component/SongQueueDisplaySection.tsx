import { useAppSelector } from "../app/hook";
import { useGetSongQueue } from "../customHooks/useGetSongQueue";
import { selectSongQueue } from "../features/song/song.slice";
import AddSongSection from "./AddSongSection";
import SongQueueList from "./SongQueueList";
import LoadingBar from "./ui/LoadingBar";
import { motion, AnimatePresence } from "framer-motion";

function SongQueueDisplaySection() {
  const { isLoading } = useGetSongQueue();
  const songQueue = useAppSelector(selectSongQueue);

  return (
    <section className="xl:w-[400px] w-full flex flex-col gap-4 xl:min-h-[calc(100vh-144px)]">
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
          <section className="flex-1 min-h-0 overflow-y-auto">
            <motion.div
              className="flex flex-col gap-3 xl:max-h-[0px] max-h-[400px]   "
              //   className="flex flex-col gap-3 xl:max-h-[600px] transition-max-height duration-500 ease-in-out max-h-[400px]  overflow-hidden "
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AnimatePresence>
                {songQueue &&
                  songQueue.map((song) => (
                    <motion.div
                      key={song._id}
                      layout
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 20,
                      }}
                    >
                      <SongQueueList song={song} />
                    </motion.div>
                  ))}
              </AnimatePresence>
            </motion.div>
          </section>
        </>
      )}
    </section>
  );
}

export default SongQueueDisplaySection;
