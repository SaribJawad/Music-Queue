import NowPlayingSection from "./ui/NowPlayingSection";
import VoteSection from "./ui/VoteSection";

function LiveStreamSection() {
  return (
    <section className="w-full sm:px-6   px-1 text-white grid grid-cols-1 lg:grid-cols-3 min-h-[calc(100%-150px)] -mt-5 gap-5">
      <NowPlayingSection />
      <VoteSection />
    </section>
  );
}

export default LiveStreamSection;
