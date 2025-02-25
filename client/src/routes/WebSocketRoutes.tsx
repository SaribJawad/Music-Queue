import { Outlet } from "react-router-dom";
import { WebSocketProvider } from "../contexts/webSocketProvider";

function WebSocketRoutes() {
  return (
    <WebSocketProvider>
      <Outlet />
    </WebSocketProvider>
  );
}

export default WebSocketRoutes;
