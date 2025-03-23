import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { ServerMessageSchema } from "../schemas/webSocketServerMessage";
import { useAppDispatch } from "../app/hook";
import { addRoom, removeRoom } from "../features/room/room.slice";
import {
  setUserEndRoom,
  setUserIsJoinedLive,
  setUserIsLive,
  setUserLeaveRoom,
} from "../features/auth/auth.slice";
import {
  setCurrentSong,
  setJoinedUsersTimestamps,
  setLiveRoom,
  setLiveRoomTimestamps,
  setNoOfJoinedUsers,
  setRemoveLiveRoom,
} from "../features/liveRoom/liveRoom.slice";
import { showToast } from "../utils/showToast";
import { useNavigate } from "react-router-dom";
import {
  setEmptySongQueue,
  setRemoveSong,
  setUpvoteSong,
  updateSongQueue,
} from "../features/song/song.slice";
import { store } from "../app/store";
import { useLoadingContext } from "./loadingActionProvider";

interface WebSocketContextType {
  sendMessage: (payload: any, action: string) => boolean;
  isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextType>({
  sendMessage: () => false,
  isConnected: false,
});

export const WebSocketProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { stopLoading } = useLoadingContext();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const sendMessage = useCallback((payload: any, action: string): boolean => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ action, payload }));
      return true;
    }
    return false;
  }, []);

  useEffect(() => {
    console.log("Setting up WebSocket connection");
    const url =
      import.meta.env.MODE === "development"
        ? "ws://localhost:3000"
        : "wss://sync-spheree.onrender.com";

    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket Connected");
      setIsConnected(true);
    };

    socket.onmessage = (event) => {
      const serverMessage = JSON.parse(event.data);

      const parsedServerMessage = ServerMessageSchema.safeParse(serverMessage);

      switch (parsedServerMessage.data?.action) {
        case "CREATE_ROOM":
          dispatch(setLiveRoom(parsedServerMessage.data.payload));
          dispatch(setUserIsLive(parsedServerMessage.data.payload._id));
          stopLoading("createRoom");
          showToast("success", "Room created!");

          break;

        case "ADD_ROOM":
          dispatch(addRoom(parsedServerMessage.data.payload));
          break;

        case "ADD_SONG":
          const currentSong = store.getState().liveRoom.liveRoom?.currentSong;
          showToast("success", "Video/song added");
          stopLoading("addSong");
          if (currentSong) {
            dispatch(updateSongQueue(parsedServerMessage.data.payload));
          } else {
            dispatch(setCurrentSong(parsedServerMessage.data.payload));
          }
          break;

        case "JOIN_ROOM":
          navigate(`/room/${parsedServerMessage.data.payload}`, {
            replace: true,
          });
          dispatch(setUserIsJoinedLive(parsedServerMessage.data.payload));
          stopLoading("joinRoom");
          break;

        case "USER_JOINED":
          showToast("emoji", parsedServerMessage.data.payload);
          break;

        case "LEAVE_ROOM":
          stopLoading("leaveRoom");
          dispatch(setUserLeaveRoom());
          dispatch(setNoOfJoinedUsers(0));
          dispatch(setEmptySongQueue());
          dispatch(setRemoveLiveRoom());
          break;

        case "LEFT_ROOM":
          showToast("emoji", parsedServerMessage.data.payload.message);
          dispatch(
            setNoOfJoinedUsers(parsedServerMessage.data.payload.noOfJoinedUsers)
          );
          break;

        case "END_ROOM":
          navigate("/room", { replace: true });
          dispatch(setEmptySongQueue());
          dispatch(setUserEndRoom(parsedServerMessage.data.payload));
          dispatch(setRemoveLiveRoom());
          dispatch(setNoOfJoinedUsers(0));
          stopLoading("endRoom");
          break;

        case "ROOM_ENDED":
          dispatch(setUserLeaveRoom());
          showToast("error", "Room ended");
          dispatch(setRemoveLiveRoom());
          dispatch(setEmptySongQueue());
          navigate("/room", { replace: true });
          break;

        case "REMOVE_ROOM":
          dispatch(removeRoom(parsedServerMessage.data.payload));
          break;

        case "REFRESH_ROOM":
          dispatch(setNoOfJoinedUsers(parsedServerMessage.data.payload));
          break;

        case "DELETE_SONG":
          dispatch(setRemoveSong(parsedServerMessage.data.payload));
          stopLoading(`deleteSong-${parsedServerMessage.data.payload}`);
          break;

        case "SONG_DELETED":
          showToast("success", parsedServerMessage.data.payload);
          break;

        case "UPVOTE_SONG":
          dispatch(setUpvoteSong(parsedServerMessage.data.payload));
          stopLoading(`upVoteSong-${parsedServerMessage.data.payload.songId}`);
          break;

        case "SYNC_ALL":
          dispatch(setLiveRoomTimestamps(parsedServerMessage.data.payload));
          break;

        case "PLAY_NEXT_SONG":
          dispatch(setRemoveSong(parsedServerMessage.data.payload._id));
          dispatch(setCurrentSong(parsedServerMessage.data.payload));
          stopLoading("playNext");
          break;

        case "TIMESTAMPS":
          dispatch(setJoinedUsersTimestamps(parsedServerMessage.data.payload));
          break;

        case "ERROR":
          stopLoading("addSong");
          showToast("error", parsedServerMessage.data.payload);
          break;
        default:
          break;
      }

      //   console.log("Received:", parsedServerMessage);
    };

    socket.onclose = () => {
      console.log("WebSocket Disconnected");
      setIsConnected(false);
    };

    socket.onerror = (error) => {
      console.error("WebSocket Error:", error);
      setIsConnected(false);
    };

    // Clean up function
    return () => {
      console.log("Cleaning up WebSocket");
      if (
        socket &&
        (socket.readyState === WebSocket.OPEN ||
          socket.readyState === WebSocket.CONNECTING)
      ) {
        socket.close();
      }
    };
  }, []);

  const contextValue = React.useMemo(
    () => ({
      sendMessage,
      isConnected,
    }),
    [sendMessage, isConnected]
  );

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = () => {
  return useContext(WebSocketContext);
};
