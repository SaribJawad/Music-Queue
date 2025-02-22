import { useState } from "react";
import LiveStreamList from "./LiveStreamList";
import { AnimatePresence } from "motion/react";
import JoinStreamDialog from "./ui/JoinStreamDialog";

function CurrentlyLiveStreamSection() {
  const [isJoinStreamDialogOpen, setIsJoinStreamDialogOpen] =
    useState<boolean>(false);

  return (
    <div className="md:w-[350px] w-full flex flex-col gap-5 ">
      <AnimatePresence>
        {isJoinStreamDialogOpen && (
          <JoinStreamDialog setIsOpen={setIsJoinStreamDialogOpen} />
        )}
      </AnimatePresence>
      <h1 className="sm:text-xl text-base font-semibold">Live streams</h1>
      <div className="flex flex-col gap-3">
        <LiveStreamList setOpenModal={setIsJoinStreamDialogOpen} />
      </div>
    </div>
  );
}

export default CurrentlyLiveStreamSection;
