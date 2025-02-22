import { useState } from "react";
import { FaYoutube } from "react-icons/fa6";
import { RiSoundcloudFill } from "react-icons/ri";
import { AnimatePresence } from "motion/react";
import CreateStreamDialog from "./ui/CreateStreamDialog";

function CreateStreamSection() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const providers = [
    { name: "Youtube", icon: <FaYoutube size={30} color="#F70000" /> },
    {
      name: "SoundCloud",
      icon: <RiSoundcloudFill size={30} color="#F76F0D" />,
    },
  ];

  return (
    <div className="flex flex-col gap-5 lg:flex-1   ">
      <AnimatePresence>
        {isModalOpen && <CreateStreamDialog setIsOpen={setIsModalOpen} />}
      </AnimatePresence>
      <h1 className="sm:text-xl text-base font-semibold  ">
        Choose a provider to create a stream
      </h1>
      <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-3 grid-cols-2 gap-3">
        {providers.map((provider) => (
          <button
            onClick={() => setIsModalOpen((prev) => !prev)}
            key={provider.name}
            className="flex    dark:bg-background_dark flex-col rounded-lg  items-center  p-4 sm:p-10 hover:rounded-none transition-all duration-300 bg-background_light"
          >
            <h3 className="md:text-base dark:text-text_dark text-text_light text-sm">
              {provider.name}
            </h3>
            {provider.icon}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CreateStreamSection;
