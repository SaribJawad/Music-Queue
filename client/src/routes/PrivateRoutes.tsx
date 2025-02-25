import { useEffect } from "react";
import { useAppSelector } from "../app/hook";
import { Outlet, useNavigate } from "react-router-dom";
import LoadingBar from "../component/ui/LoadingBar";

function PrivateRoutes() {
  const { isAuthenticated, isLive, isAuthLoading } = useAppSelector(
    (state) => state.auth
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    } else if (isLive && isAuthenticated) {
      navigate("/room/1231", { replace: true });
    }
  }, [isAuthenticated, isLive]);

  if (isAuthLoading) {
    return (
      <div className="h-dvh w-full flex items-center justify-center dark:bg-background_dark bg-background_light ">
        <LoadingBar />
      </div>
    );
  }

  return <Outlet />;
}
export default PrivateRoutes;
