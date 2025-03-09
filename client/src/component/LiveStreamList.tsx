import { AnimatePresence } from "motion/react";
import Button from "./Button";
import JoinStreamDialog from "./ui/JoinStreamDialog";
import { useState } from "react";

interface LiveStreamListProps {
  roomName: string;
  roomType: string;
  roomId: string;
}

function LiveStreamList({ roomName, roomType, roomId }: LiveStreamListProps) {
  const [isJoinStreamDialogOpen, setIsJoinStreamDialogOpen] =
    useState<boolean>(false);
  return (
    <div className="w-full  flex items-center justify-between ">
      <AnimatePresence>
        {isJoinStreamDialogOpen && (
          <JoinStreamDialog
            setIsOpen={setIsJoinStreamDialogOpen}
            roomId={roomId}
          />
        )}
      </AnimatePresence>
      <div className="flex flex-col">
        <h3 className="sm:text-base text-sm text-text_dark_secondary dark:text-text_dark">
          {roomName}
        </h3>
        <span className="text-xs dark:border-l-text_dark">{roomType}</span>
      </div>
      <Button onClick={() => setIsJoinStreamDialogOpen(true)} size="sm">
        Join
      </Button>
    </div>
  );
}

export default LiveStreamList;
