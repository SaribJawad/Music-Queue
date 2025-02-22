import Navbar from "../component/Navbar";
import CreateStreamSection from "../component/CreateStreamSection";
import CurrentlyLiveStreamSection from "../component/CurrentlyLiveStreamSection";
import { useGetUser } from "../customHooks/useGetUser";
import LoadingBar from "../component/ui/LoadingBar";

function StreamPage() {
  const { isLoading } = useGetUser();

  if (isLoading) {
    <LoadingBar />;
  }
  return (
    <main className="min-h-dvh w-full flex flex-col     bg-background_light dark:bg-background_dark text-text_light dark:text-text_dark px-5 sm:px-7 sm:py-7 py-5 ">
      <Navbar variant="user" username="sarib jawad" />
      <section className=" flex-1 flex md:flex-row flex-col  rounded-md gap-6 dark:bg-background_dark_secondary bg-background_light_secondary dark:text-white text-text_light p-3 sm:p-5">
        <CreateStreamSection />
        <span className="md:w-[1px] w-full md:h-auto h-[1px]  dark:bg-text_dark bg-text_light"></span>
        <CurrentlyLiveStreamSection />
      </section>
    </main>
  );
}

export default StreamPage;
