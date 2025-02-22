import Navbar from "../component/Navbar";
import SongQueueDisplaySection from "../component/SongQueueDisplaySection";
import YoutubeDisplaySection from "../component/YoutubeDisplaySection";

function LiveStreamPage() {
  return (
    <main className="min-h-dvh flex flex-col w-full bg-background_light dark:bg-background_dark text-text_light dark:text-text_dark  sm:px-5 sm:py-5 py-3 px-3">
      <Navbar variant="stream" username="Sarib jawad" />
      <section className="flex-1 rounded-md xl:flex-row flex-col dark:bg-background_dark_secondary bg-background_light_secondary sm:p-5 p-3 flex gap-3">
        <YoutubeDisplaySection />
        <span className="xl:w-[1px] w-full xl:h-auto h-[1px]  dark:bg-text_dark bg-text_light"></span>
        <SongQueueDisplaySection />
      </section>
    </main>
  );
}

export default LiveStreamPage;
