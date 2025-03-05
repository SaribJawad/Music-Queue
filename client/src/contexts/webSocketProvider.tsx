import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { ServerMessageSchema } from "../schemas/webSocketServerMessage";
import { useAppDispatch, useAppSelector } from "../app/hook";
import { addRoom } from "../features/room/room.slice";
import {
  setUserIsJoinedLive,
  setUserIsLive,
} from "../features/auth/auth.slice";
import { updateSongQueue } from "../features/song/song.slice";
import {
  selectLiveRoom,
  setCurrentSong,
} from "../features/liveRoom/liveRoom.slice";
import { showToast } from "../utils/showToast";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const liveRoom = useAppSelector(selectLiveRoom);
  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const sendMessage = useCallback((payload: any, action: string): boolean => {
    console.log("sendMessage", payload, action);
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ action, payload }));
      return true;
    }
    return false;
  }, []);

  useEffect(() => {
    console.log("Setting up WebSocket connection");
    const socket = new WebSocket("ws://localhost:3000");
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
          dispatch(setUserIsLive(parsedServerMessage.data.payload._id));
          break;

        case "ADD_ROOM":
          dispatch(addRoom(parsedServerMessage.data.payload));
          break;

        case "ADD_SONG":
          if (liveRoom?.currentSong !== null) {
            dispatch(updateSongQueue(parsedServerMessage.data.payload));
          } else {
            dispatch(setCurrentSong(parsedServerMessage.data.payload));
          }
          break;

        case "JOIN_ROOM":
          dispatch(setUserIsJoinedLive(parsedServerMessage.data.payload));
          navigate(`/room/${parsedServerMessage.data.payload}`, {
            replace: true,
          });
          break;

        case "USER_JOINED":
          showToast("emoji", parsedServerMessage.data.payload);
          break;

        case "ERROR":
          showToast("error", parsedServerMessage.data.payload);
          break;
        default:
          break;
      }

      console.log("Received:", parsedServerMessage);
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
