import { Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "./page/LandingPage";
import LoginPage from "./page/LoginPage";
import { useAuthContext } from "./contexts/authContext";
import { useEffect, useState } from "react";
import { api } from "./config/axios";
import LoadingBar from "./component/ui/LoadingBar";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./component/ProtectedRoute";
import StreamPage from "./page/StreamPage";

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
          localStorage.setItem("isAuthenticated", "true"); // Set directly here
        }
      } catch {
        setIsAuthenticated("false");
        setUserInfo(null);
        localStorage.setItem("isAuthenticated", "false"); // Set directly here
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
              <Navigate
                to={localStorage.getItem("redirectUrl") || "/stream"}
                replace
              />
            ) : (
              <LoginPage />
            )
          }
        />
        <Route
          path="/stream/:streamId?"
          element={
            <ProtectedRoute>
              <StreamPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
{
  /* <Route
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
/> */
}
