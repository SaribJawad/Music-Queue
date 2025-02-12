import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../config/axios";
import { toast } from "react-toastify";
import { useStreamContext } from "./streamContext";
import { ISong } from "../types/types";

interface SongContextType {
  addSong(streamId: string, songUrl: string): Promise<void>;
  upVoteSong(songId: string, streamId: string): Promise<void>;
  downVoteSong(songId: string, streamId: string): Promise<void>;
  getSongQueue(streamId: string): Promise<void>;
  playNext(streamId: string): Promise<void>;
  songQueue: ISong[];
  isAddSongLoading: boolean;
}

export const SongContext = createContext<SongContextType | null>(null);

export const SongContextProvder = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isAddSongLoading, setIsAddSongLoading] = useState<boolean>(false);
  const [songQueue, setSongQueue] = useState<ISong[]>([]);
  const { getStream } = useStreamContext();

  async function getSongQueue(streamId: string) {
    try {
      const response = await api.get(`stream/song-queue/${streamId}`);

      if (response.status === 200) {
        setSongQueue(response.data.data);
      }
    } catch (error) {
      toast.error("Something went wrong while fetching song queue!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }

  async function addSong(streamId: string, songUrl: string) {
    try {
      setIsAddSongLoading(true);
      const response = await api.post(`song/add-song/${streamId}`, {
        url: songUrl,
      });
      if (response.status === 201) {
        // Later fix with websocket
        await getSongQueue(streamId);
        toast.success("Song added", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setIsAddSongLoading(false);
      }
    } catch (error) {
      setIsAddSongLoading(false);
      toast.error("Something went wrong while adding song!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }

  async function upVoteSong(songId: string, streamId: string) {
    try {
      const response = await api.post(`/song/upvote-song/${songId}`);

      if (response.status === 200) {
        // Later fix with websocket
        await getSongQueue(streamId);
        toast.success("Up voted", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      toast.error("Something went wrong while upvoting song!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }

  async function downVoteSong(songId: string, streamId: string) {
    try {
      const response = await api.post(`/song/downvote-song/${songId}`);

      if (response.status === 200) {
        // Later fix with websocket
        await getSongQueue(streamId);
        toast.success("Down voted", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      toast.error("Something went wrong while down voting song!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }

  async function playNext(streamId: string) {
    if (songQueue.length <= 0) {
      toast.info("Currently no song in queue!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    try {
      const response = await api.post(`stream/play-next/${streamId}`);
      if (response.status === 200) {
        // await getSongQueue(streamId);
        await getStream(streamId);
        toast.success("Playing next song!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      toast.error("Something went wrong while playing next song!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }

  return (
    <SongContext.Provider
      value={{
        addSong,
        isAddSongLoading,
        upVoteSong,
        downVoteSong,
        getSongQueue,
        songQueue,
        playNext,
      }}
    >
      {children}
    </SongContext.Provider>
  );
};

export const useSongContext = () => {
  const context = useContext(SongContext);
  if (!context) throw new Error("useSongContext must be user within provider");
  return context;
};
