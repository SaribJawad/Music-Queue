import React, { createContext, useContext, useEffect, useState } from "react";
import { IStream } from "../types/types";
import { api } from "../config/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface StreamContextType {
  stream: IStream | null;
  setStream: React.Dispatch<React.SetStateAction<IStream | null>>;
  allStreams: IStream[];
  setAllStreams: React.Dispatch<React.SetStateAction<IStream[]>>;
  isAllStreamsLoading: boolean;
  setIsAllStreamsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  getStream: (streamId: string) => Promise<void>;
  isCreateStreamLoading: boolean;
  setIsCreateStreamLoading: React.Dispatch<React.SetStateAction<boolean>>;
  createStream: (streamType: string) => Promise<void>;
  isGetStreamLoading: boolean;
  setIsGetStreamLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const StreamContext = createContext<StreamContextType | null>(null);

export const StreamContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [stream, setStream] = useState<IStream | null>(null);
  const [allStreams, setAllStreams] = useState<IStream[]>([]);
  const [isAllStreamsLoading, setIsAllStreamsLoading] = useState<boolean>(true);
  const [isGetStreamLoading, setIsGetStreamLoading] = useState<boolean>(true);
  const [isCreateStreamLoading, setIsCreateStreamLoading] =
    useState<boolean>(false);

  const navigate = useNavigate();

  const createStream = async (streamType: string) => {
    try {
      setIsCreateStreamLoading(true);
      const response = await api.post("/stream/create-stream", { streamType });
      navigate(`/stream/${response.data.data._id}`);
    } catch (error) {
      toast.error("Something went wrong while creating stream", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setIsCreateStreamLoading(false);
    } finally {
      setIsCreateStreamLoading(false);
    }
  };

  const getStream = async (streamId: string) => {
    try {
      setIsGetStreamLoading(true);
      const response = await api.get(`/stream/${streamId}`);
      setStream(response.data.data);
    } catch (error) {
      setIsGetStreamLoading(false);
      toast.error("Something went wrong while getting stream", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsGetStreamLoading(false);
    }
  };

  useEffect(() => {
    const getStreams = async () => {
      setIsAllStreamsLoading(true);
      const response = await api.get("/stream/get-all-streams");

      if (response.status === 200) {
        setIsAllStreamsLoading(false);
        setAllStreams(response.data.data);
      } else {
        setIsAllStreamsLoading(false);
        setAllStreams([]);

        toast.error("Something went wrong while getting streams!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    };

    getStreams();
  }, []);

  return (
    <StreamContext.Provider
      value={{
        isGetStreamLoading,
        setIsGetStreamLoading,
        getStream,
        stream,
        setStream,
        setAllStreams,
        allStreams,
        isAllStreamsLoading,
        setIsAllStreamsLoading,
        isCreateStreamLoading,
        setIsCreateStreamLoading,
        createStream,
      }}
    >
      {children}
    </StreamContext.Provider>
  );
};

export const useStreamContext = () => {
  const context = useContext(StreamContext);
  if (!context)
    throw new Error("useStreamContext must be user within provider");

  return context;
};
