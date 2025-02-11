import Button from "../component/Button";
import ThemeToggle from "../component/ui/ThemeToggle";
import { useAuthContext } from "../contexts/authContext";
import Modal from "../component/Modal";
import { useEffect, useState } from "react";
import ErrorDisplay from "../component/ui/ErrorDisplay";
import ChooseStreamSection from "../component/ChooseStreamSection";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function StartStreamPage() {
  const { userInfo, logout } = useAuthContext();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const navigate = useNavigate();

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

  useEffect(() => {
    if (userInfo?.isAlive) {
      toast.warning("You are currently live!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      navigate(`/stream/${userInfo.streams[0]}`);
    }
  }, [userInfo?.isAlive]);

  const handleModal = () => {
    setIsModalOpen(true);
  };

  return (
    <div
      className={` min-h-dvh w-full dark:bg-background_dark bg-background_light px-5 py-3 flex flex-col gap-10`}
    >
      <ErrorDisplay />
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
          <Button size="sm" onClick={handleModal}>
            Logout
          </Button>
          <ThemeToggle />
        </div>
      </nav>
      <ChooseStreamSection />
    </div>
  );
}

export default StartStreamPage;
