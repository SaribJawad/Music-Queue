import { Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "./page/LandingPage";
import LoginPage from "./page/LoginPage";
import StreamPage from "./page/StreamPage";
import { useAuthContext } from "./contexts/authContext";
import { useEffect, useState } from "react";
import { api } from "./config/axios";
import LoadingBar from "./component/ui/LoadingBar";

function App() {
  const { isAuthenticated, setIsAuthenticated, setUserInfo } = useAuthContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/auth/get-user");
        if (response.status === 200) {
          setIsAuthenticated(true);
          setUserInfo(response.data.data);
          setIsLoading(false);
        } else {
          setIsAuthenticated(false);
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
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/auth"
        element={
          isAuthenticated ? <Navigate to="/stream" replace /> : <LoginPage />
        }
      />
      <Route
        path="/stream"
        element={
          isAuthenticated ? <StreamPage /> : <Navigate to="/auth" replace />
        }
      />
    </Routes>
  );
}

export default App;
