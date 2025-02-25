import { Outlet, useNavigate } from "react-router-dom";
import { useAppSelector } from "../app/hook";
import { useEffect } from "react";
import LoadingBar from "../component/ui/LoadingBar";

function PublicRoutes() {
  const { isAuthenticated, isLive, isAuthLoading } = useAppSelector(
    (state) => state.auth
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !isLive) {
      navigate("/room", { replace: true });
    } else if (isLive) {
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

export default PublicRoutes;
