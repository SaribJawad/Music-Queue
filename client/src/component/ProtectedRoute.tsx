import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/authContext";
import { useEffect } from "react";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthContext();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated === "false" && location.pathname !== "/stream") {
      localStorage.setItem("redirectUrl", location.pathname);
    } else {
      localStorage.removeItem("redirectUrl");
    }
  }, [isAuthenticated, location]);

  if (isAuthenticated === "false") {
    return <Navigate to="/auth" replace={true} />;
  }

  return children;
}

export default ProtectedRoute;
