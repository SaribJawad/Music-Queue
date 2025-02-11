import { Navigate } from "react-router-dom";
import { useAuthContext } from "../contexts/authContext";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthContext();

  if (isAuthenticated === "false") {
    return <Navigate to={"/auth"} state={{ from: window.location.pathname }} />;
  }

  return children;
}

export default ProtectedRoute;
