import { useNavigate, useParams } from "react-router-dom";
import Button from "./Button";
import ThemeToggle from "./ui/ThemeToggle";
import { useState } from "react";
import { AnimatePresence } from "motion/react";
import Dialog from "./ui/Dialog";
import { useWebSocketContext } from "../contexts/webSocketProvider";
import { showToast } from "../utils/showToast";
import { useAppDispatch, useAppSelector } from "../app/hook";
import { selectUserInfo, setLogout } from "../features/auth/auth.slice";
import { api } from "../config/axios";

interface NavbarProps {
  variant?: NavbarVariant;
  username?: string;
  isAdmin?: boolean;
}

type NavbarVariant = "guest" | "user" | "stream";

const Navbar = ({ variant = "guest", username, isAdmin }: NavbarProps) => {
  const [dialog, setDialog] = useState<
    "logout" | "endRoom" | "leaveRoom" | null
  >(null);
  const dispatch = useAppDispatch();
  const { isConnected, sendMessage } = useWebSocketContext();
  const loggedInUser = useAppSelector(selectUserInfo);
  const navigate = useNavigate();
  const { roomId } = useParams();

  const handleDialogClose = () => {
    setDialog(null);
  };

  const handleLeaveRoom = () => {
    const sent = sendMessage(
      { roomId, userId: loggedInUser?._id },
      "LEAVE_ROOM"
    );

    if (sent) {
      return;
    } else if (isConnected) {
      console.warn(
        "Failed to send message even though connection is established"
      );
    } else {
      setDialog(null);
      showToast("error", "Something went wrong! Try again.");
    }
    navigate("/room", { replace: true });
  };

  const handleEndRoom = () => {
    const endRoomPayload = {
      roomId,
      userId: loggedInUser?._id,
    };

    const sent = sendMessage(endRoomPayload, "END_ROOM");

    if (sent) {
      return;
    } else if (isConnected) {
      console.warn(
        "Failed to send message even though connection is established"
      );
    } else {
      showToast("error", "Something went wrong! Try again.");
    }

    showToast("success", "Room ended.");
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/google/logout");

      dispatch(setLogout());

      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const renderLeftContent = () => {
    switch (variant) {
      case "guest":
        return <h1>SyncSphere</h1>;

      case "stream":
        return (
          <h1 className="text-text_dark_secondary dark:text-text_dark sm:text-base text-sm">
            <b>{username}'s</b> room
          </h1>
        );

      case "user":
        return (
          <h1>
            Welcome,{" "}
            <b className="text-text_dark_secondary dark:text-text_dark">
              {username}
            </b>
          </h1>
        );

      default:
        return null;
    }
  };

  const renderRightContent = () => {
    return (
      <div className="flex items-center gap-2">
        <AnimatePresence>
          {dialog === "logout" && (
            <Dialog
              onClickBtn={handleLogout}
              closeDialog={handleDialogClose}
              title="You sure you want to logout"
              btnContent="Logout"
            />
          )}
          {dialog === "endRoom" && (
            <Dialog
              closeDialog={handleDialogClose}
              onClickBtn={handleEndRoom}
              title="You sure you want to end Stream?"
              btnContent="End rooom"
            />
          )}
          {dialog === "leaveRoom" && (
            <Dialog
              closeDialog={handleDialogClose}
              onClickBtn={handleLeaveRoom}
              title="You sure you want to leave Stream?"
              btnContent="leave room"
            />
          )}
        </AnimatePresence>
        {variant === "user" && (
          <Button size="sm" onClick={() => setDialog("logout")}>
            Logout
          </Button>
        )}
        {variant === "stream" &&
          (isAdmin ? (
            <Button size="sm" onClick={() => setDialog("endRoom")}>
              End Room
            </Button>
          ) : (
            <Button size="sm" onClick={() => setDialog("leaveRoom")}>
              Leave room
            </Button>
          ))}
        <ThemeToggle />
      </div>
    );
  };

  return (
    <nav className="flex items-center justify-between  p-2 sm:p-4 ">
      {renderLeftContent()}
      {renderRightContent()}
    </nav>
  );
};

export default Navbar;
