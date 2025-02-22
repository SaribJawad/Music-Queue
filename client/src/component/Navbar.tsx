import { useNavigate } from "react-router-dom";
import Button from "./Button";
import ThemeToggle from "./ui/ThemeToggle";
import { useState } from "react";
import { AnimatePresence } from "motion/react";
import Dialog from "./ui/Dialog";

interface NavbarProps {
  variant?: NavbarVariant;
  username?: string;
}

type NavbarVariant = "guest" | "user" | "stream";

const Navbar = ({ variant = "guest", username }: NavbarProps) => {
  const [dialog, setDialog] = useState<"logout" | "endStream" | null>(null);
  const navigate = useNavigate();

  const handleDialogClose = () => {
    setDialog(null);
  };

  const renderLeftContent = () => {
    switch (variant) {
      case "guest":
        return (
          <Button onClick={() => navigate(-1)} size="sm">
            Go Back
          </Button>
        );

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
              closeDialog={handleDialogClose}
              title="You sure you want to logout"
              btnContent="Logout"
            />
          )}
          {dialog === "endStream" && (
            <Dialog
              closeDialog={handleDialogClose}
              title="You sure you want to end Stream?"
              btnContent="End stream"
            />
          )}
        </AnimatePresence>
        {variant === "user" && (
          <Button size="sm" onClick={() => setDialog("logout")}>
            Logout
          </Button>
        )}
        {variant === "stream" && (
          <Button size="sm" onClick={() => setDialog("endStream")}>
            End stream
          </Button>
        )}
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
