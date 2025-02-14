import React, { createContext, useContext, useState } from "react";
import { IStream } from "../types/types";
import { api } from "../config/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface StreamContextType {
  stream: IStream | null;
  setStream: React.Dispatch<React.SetStateAction<IStream | null>>;
  endStream: (streamId: string) => Promise<void>;
  isAllStreamsLoading: boolean;
  setIsAllStreamsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  getStream: (streamId: string) => Promise<void>;
  isCreateStreamLoading: boolean;
  setIsCreateStreamLoading: React.Dispatch<React.SetStateAction<boolean>>;
  createStream: (streamType: string) => Promise<void>;
  isGetStreamLoading: boolean;
  setIsGetStreamLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

export const StreamContext = createContext<StreamContextType | null>(null);

export const StreamContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [stream, setStream] = useState<IStream | null>(null);
  const [isAllStreamsLoading, setIsAllStreamsLoading] = useState<boolean>(true);
  const [isGetStreamLoading, setIsGetStreamLoading] = useState<boolean>(true);
  const [isCreateStreamLoading, setIsCreateStreamLoading] =
    useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const createStream = async (streamType: string) => {
    try {
      setIsCreateStreamLoading(true);
      const response = await api.post("/stream/create-stream", { streamType });
      navigate(`/stream/${response.data.data._id}`);
    } catch (error) {
      setError("Something went wrong while creating stream");
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
      setError("Something went wrong while joining stream");

      navigate("/stream");
    } finally {
      setIsGetStreamLoading(false);
    }
  };

  const endStream = async (streamId: string) => {
    try {
      const response = await api.delete(`/stream/${streamId}`);

      if (response.status === 200) {
        toast.success("Stream ended", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        navigate("/stream");
      }
    } catch (error) {
      setError("Something went wrong while deleting stream");
    } finally {
      setIsGetStreamLoading(false);
    }
  };

  return (
    <StreamContext.Provider
      value={{
        isGetStreamLoading,
        setIsGetStreamLoading,
        getStream,
        stream,
        setStream,
        error,
        setError,
        isAllStreamsLoading,
        setIsAllStreamsLoading,
        isCreateStreamLoading,
        setIsCreateStreamLoading,
        createStream,
        endStream,
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
