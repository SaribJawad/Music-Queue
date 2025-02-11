import { Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "./page/LandingPage";
import LoginPage from "./page/LoginPage";
import { useAuthContext } from "./contexts/authContext";
import { useEffect, useState } from "react";
import { api } from "./config/axios";
import LoadingBar from "./component/ui/LoadingBar";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./component/ProtectedRoute";
import StartStreamPage from "./page/StartStreamPage";
import LiveStreamPage from "./page/LiveStreamPage";

function App() {
  const { isAuthenticated, setIsAuthenticated, setUserInfo } = useAuthContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/auth/get-user");

        if (response.status === 200) {
          setIsAuthenticated("true");
          setUserInfo(response.data.data);

          const redirectUrl = localStorage.getItem("redirectAfterLogin");
          if (redirectUrl) {
            window.location.href = redirectUrl;
            localStorage.removeItem("redirectAfterLogin");
            return;
          }
        }
      } catch {
        setIsAuthenticated("false");
        setUserInfo(null);
      } finally {
        setIsLoading(false);
        localStorage.setItem("isAuthenticated", isAuthenticated!);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="h-dvh w-dvw dark:bg-background_dark dark:text-text_dark bg-background_light text-text_light flex items-center justify-center">
        <LoadingBar />
      </div>
    );
  }

  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/auth"
          element={
            isAuthenticated === "true" ? (
              <Navigate to="/stream" replace />
            ) : (
              <LoginPage />
            )
          }
        />
        <Route
          path="/stream"
          element={
            <ProtectedRoute>
              <StartStreamPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stream/:streamId"
          element={
            <ProtectedRoute>
              <LiveStreamPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
