import { useParams } from "react-router-dom";
import NowPlayingSection from "./ui/NowPlayingSection";
import VoteSection from "./ui/VoteSection";
import { useStreamContext } from "../contexts/streamContext";
import { useEffect } from "react";

function LiveStreamSection() {
  const { userId } = useParams();
  const { getStream, stream, isGetStreamLoading } = useStreamContext();

  useEffect(() => {
    if (userId) getStream(userId);
  }, []);
  return (
    <section className="w-full sm:px-6   px-1 text-white grid grid-cols-1 lg:grid-cols-3 min-h-[calc(100%-150px)] -mt-5 gap-5">
      <NowPlayingSection currentSong={stream?.currentSong!} />
      <VoteSection songQueue={stream?.songQueue!} />
    </section>
  );
}

export default LiveStreamSection;
