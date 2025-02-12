import { useParams } from "react-router-dom";
import NowPlayingSection from "./ui/NowPlayingSection";
import VoteSection from "./ui/VoteSection";
import { useStreamContext } from "../contexts/streamContext";
import { useEffect } from "react";
import LoadingBar from "./ui/LoadingBar";
import { useAuthContext } from "../contexts/authContext";

function LiveStreamSection() {
  const { streamId } = useParams();
  const { getStream, stream, isGetStreamLoading } = useStreamContext();
  const { userInfo } = useAuthContext();
  const isOwner = stream?.owner._id === userInfo?._id;

  useEffect(() => {
    if (streamId && !stream) {
      getStream(streamId);
    }
  }, [streamId]);

  if (isGetStreamLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <LoadingBar />
      </div>
    );
  }

  return (
    <section className="w-full sm:px-6   px-1 text-white grid grid-cols-1 lg:grid-cols-3 min-h-[calc(100%-150px)] -mt-5 gap-5">
      <NowPlayingSection currentSong={stream?.currentSong!} isOwner={isOwner} />
      <VoteSection />
    </section>
  );
}

export default LiveStreamSection;
