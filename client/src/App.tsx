import { Route, Routes } from "react-router-dom";
import LandingPage from "./page/LandingPage";
import { ToastContainer } from "react-toastify";
import LoginPage from "./page/LoginPage";
import StreamPage from "./page/StreamPage";
import LiveStreamPage from "./page/LiveStreamPage";
import NotFoundPage from "./page/NotFoundPage";
import { useGetUser } from "./customHooks/useGetUser";
import LoadingBar from "./component/ui/LoadingBar";

function App() {
  const { isLoading } = useGetUser();

  if (isLoading) {
    <LoadingBar />;
  }

  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/stream" element={<StreamPage />} />
        <Route path="/stream/:streamId" element={<LiveStreamPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
