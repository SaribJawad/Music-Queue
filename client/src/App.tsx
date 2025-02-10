import { Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "./page/LandingPage";
import LoginPage from "./page/LoginPage";
import StreamPage from "./page/StreamPage";
import { useAuthContext } from "./contexts/authContext";
import { useEffect, useState } from "react";
import { api } from "./config/axios";
import LoadingBar from "./component/ui/LoadingBar";
import { ToastContainer } from "react-toastify";

function App() {
  const { isAuthenticated, setIsAuthenticated, setUserInfo } = useAuthContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/auth/get-user");
        if (response.status === 200) {
          localStorage.setItem("isAuthenticated", "true");
          setIsAuthenticated(localStorage.getItem("isAuthenticated"));
          setUserInfo(response.data.data);
          setIsLoading(false);
        } else {
          localStorage.setItem("isAuthenticated", "false");
          setIsAuthenticated(localStorage.getItem("isAuthenticated"));
          setUserInfo(null);
          setIsLoading(false);
        }
      } finally {
        setIsLoading(false);
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
          path="/stream/:userId?"
          element={
            isAuthenticated === "true" ? (
              <StreamPage />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
      </Routes>
    </div>
  );
}

export default App;
