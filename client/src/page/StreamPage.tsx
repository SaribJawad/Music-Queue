import { FiShare2 } from "react-icons/fi";
import Button from "../component/Button";
import ThemeToggle from "../component/ui/ThemeToggle";
import { useAuthContext } from "../contexts/authContext";
import Modal from "../component/Modal";
import { useEffect, useState } from "react";
import EmptyStreamSection from "../component/EmptyStreamSection";
import LiveStreamSection from "../component/LiveStreamSection";
import { useParams } from "react-router-dom";

function StreamPage() {
  const { userInfo, logout } = useAuthContext();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { userId } = useParams();

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
    <div
      className={` min-h-dvh w-full dark:bg-background_dark bg-background_light px-5 py-3 flex flex-col gap-10`}
    >
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
          <Button size="sm">
            <FiShare2 /> Share
          </Button>
          <Button size="sm" onClick={handleModal}>
            Logout
          </Button>
          <ThemeToggle />
        </div>
      </nav>

      {userId ? <LiveStreamSection /> : <EmptyStreamSection />}
    </div>
  );
}

export default StreamPage;
