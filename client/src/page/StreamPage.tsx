import { FiShare2 } from "react-icons/fi";
import Button from "../component/Button";
import ThemeToggle from "../component/ui/ThemeToggle";
import VoteSection from "../component/ui/VoteSection";
import NowPlayingSection from "../component/ui/NowPlayingSection";
import { useAuthContext } from "../contexts/authContext";

function StreamPage() {
  const { userInfo, logout } = useAuthContext();

  return (
    <div className="min-h-dvh h-full w-full dark:bg-background_dark bg-background_light px-5 py-3 flex flex-col gap-10">
      <nav className="py-2 sm:px-6 px-1 flex items-center justify-between lg:w-[80%] w-full lg:mx-auto  ">
        <div className="flex items-center gap-4 text-text_light dark:text-text_dark">
          <img
            width={45}
            className="rounded-full"
            src={userInfo?.avatar}
            alt=""
          />
          <h1 className="font-semibold">{userInfo?.name}</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button size="sm">
            <FiShare2 /> Share
          </Button>
          <Button size="sm" onClick={logout}>
            Logout
          </Button>
          <ThemeToggle />
        </div>
      </nav>

      <section className="w-full sm:px-6   px-1 text-white grid grid-cols-1 lg:grid-cols-3 min-h-[calc(100%-150px)] -mt-5 gap-5">
        <NowPlayingSection />
        <VoteSection />
      </section>
    </div>
  );
}

export default StreamPage;
