import Navbar from "../component/Navbar";
import CurrentlyLiveStreamSection from "../component/CurrentlyLiveStreamSection";
import { useAppSelector } from "../app/hook";
import { selectUserInfo } from "../features/auth/auth.slice";
import CreateRoomSection from "../component/CreateRoomSection";

function RoomPage() {
  const loggedInUser = useAppSelector(selectUserInfo);

  return (
    <main className="min-h-dvh w-full flex flex-col     bg-background_light dark:bg-background_dark text-text_light dark:text-text_dark  sm:px-5 sm:py-5 py-2 px-2">
      <Navbar variant="user" username={loggedInUser?.name} />
      <section className=" flex-1 flex md:flex-row flex-col  rounded-md gap-6 dark:bg-background_dark_secondary bg-background_light_secondary dark:text-white text-text_light p-3 sm:p-5">
        <CreateRoomSection />
        <span className="md:w-[1px] w-full md:h-auto h-[1px]  dark:bg-text_dark bg-text_light"></span>
        <CurrentlyLiveStreamSection />
      </section>
    </main>
  );
}

export default RoomPage;
