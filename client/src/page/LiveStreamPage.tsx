import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useAuthContext } from "../contexts/authContext";
import { useParams } from "react-router-dom";
import Button from "../component/Button";
import { FiShare2 } from "react-icons/fi";
import ThemeToggle from "../component/ui/ThemeToggle";
import LiveStreamSection from "../component/LiveStreamSection";
import Modal from "../component/Modal";
import { SongContextProvder } from "../contexts/songContext";

function LiveStreamPage() {
  const { streamId } = useParams();
  const { userInfo, logout } = useAuthContext();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("URL copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy URL");
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  const handleModal = () => {
    setIsModalOpen(true);
  };

  return (
    <SongContextProvder>
      <div className="min-h-dvh w-full dark:bg-background_dark bg-background_light px-5 py-3 flex flex-col gap-10">
        {isModalOpen && (
          <Modal
            content="Are you sure you want to logout? it will remove the stream too."
            buttonContent="Yes"
            handleModal={setIsModalOpen}
            buttonOnClick={logout}
          />
        )}
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
            {streamId && (
              <Button onClick={handleShare} size="sm">
                <FiShare2 /> Share
              </Button>
            )}
            <Button size="sm" onClick={handleModal}>
              Logout
            </Button>
            <ThemeToggle />
          </div>
        </nav>
        <LiveStreamSection />
      </div>
    </SongContextProvder>
  );
}

export default LiveStreamPage;
