import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

interface VolumeControlButtonProps {
  youtubePlayer?: YT.Player;
}

function VolumeControlButton({ youtubePlayer }: VolumeControlButtonProps) {
  const [volume, setVolume] = useState(50);
  const [isHovered, setIsHovered] = useState(false);
  const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(volume);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);

    if (youtubePlayer && typeof youtubePlayer.setVolume === "function") {
      youtubePlayer.setVolume(newVolume);
    }

    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setVolume(previousVolume);
      setIsMuted(false);

      if (youtubePlayer && typeof youtubePlayer.setVolume === "function") {
        youtubePlayer.setVolume(previousVolume);
      }
    } else {
      setPreviousVolume(volume);
      setVolume(0);
      setIsMuted(true);

      if (youtubePlayer && typeof youtubePlayer.setVolume === "function") {
        youtubePlayer.setVolume(0);
      }
    }
  };

  const handleMouseEnter = () => {
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      setHideTimeout(null);
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setIsHovered(false);
    }, 1000);
    setHideTimeout(timeout);
  };

  useEffect(() => {
    return () => {
      if (hideTimeout) clearTimeout(hideTimeout);
    };
  }, [hideTimeout]);

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="1" y1="1" x2="23" y2="23"></line>
          <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
          <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
        </svg>
      );
    } else if (volume < 50) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        </svg>
      );
    } else {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
        </svg>
      );
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="relative flex items-center justify-center">
        <button
          className="p-2 rounded-full dark:bg-background_dark_secondary bg-background_light_secondary hover:bg-background_blue hover:text-text_dark dark:hover:bg-background_blue focus:outline-none transition-colors"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={toggleMute}
        >
          {getVolumeIcon()}
        </button>

        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ ease: "backInOut" }}
            >
              <div
                className="absolute -left-12 -top-24 dark:bg-background_dark_secondary items-center justify-center bg-background_light_secondary shadow-lg flex rounded-lg px-2 py-3 w-32 transform rotate-[-90deg]"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-full h-[6px] bg-gray-500 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default VolumeControlButton;
