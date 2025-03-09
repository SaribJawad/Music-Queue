import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LandingPage from "./page/LandingPage";
import LoginPage from "./page/LoginPage";
import NotFoundPage from "./page/NotFoundPage";
import PrivateRoutes from "./routes/PrivateRoutes";
import PublicRoutes from "./routes/PublicRoutes";
import RoomPage from "./page/RoomPage";
import { useGetUser } from "./customHooks/useGetUser";
import LoadingBar from "./component/ui/LoadingBar";
import WebSocketRoutes from "./routes/WebSocketRoutes";
import LiveRoomPage from "./page/LiveRoomPage";

function App() {
  const { isLoading } = useGetUser();

  if (isLoading) {
    return (
      <div className="h-dvh w-full flex items-center justify-center dark:bg-background_dark bg-background_light ">
        <LoadingBar />
      </div>
    );
  }

  return (
    <div>
      <Toaster position="top-right" />
      <Routes>
        <Route index element={<LandingPage />} />
        <Route element={<PublicRoutes />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
        <Route element={<PrivateRoutes />}>
          <Route element={<WebSocketRoutes />}>
            <Route path="/room" element={<RoomPage />} />
            <Route path="/room/:roomId" element={<LiveRoomPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
