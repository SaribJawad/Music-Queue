import { useState } from "react";
import LiveStreamList from "./LiveStreamList";
import { AnimatePresence } from "motion/react";
import JoinStreamDialog from "./ui/JoinStreamDialog";
import { useGetRooms } from "../customHooks/useGetRooms";
import LoadingBar from "./ui/LoadingBar";
import { useAppSelector } from "../app/hook";
import { selectAllRooms } from "../features/room/room.slice";

function CurrentlyLiveStreamSection() {
  const { isLoading: isGettingRoomLoading } = useGetRooms();
  const rooms = useAppSelector(selectAllRooms);
  //   const [isJoinStreamDialogOpen, setIsJoinStreamDialogOpen] =
  //     useState<boolean>(false);

  return (
    <div className="md:w-[350px] w-full flex flex-col gap-5 ">
      {/* <AnimatePresence>
        {isJoinStreamDialogOpen && (
          <JoinStreamDialog setIsOpen={setIsJoinStreamDialogOpen} />
        )}
      </AnimatePresence> */}
      <h1 className="sm:text-xl text-base font-semibold">Live streams</h1>
      <div className="flex flex-col gap-3">
        {isGettingRoomLoading ? (
          <div className="h-full w-full flex items-center justify-center">
            <LoadingBar />
          </div>
        ) : (
          rooms?.map((room) => (
            <LiveStreamList
              key={room._id}
              roomName={room.roomName}
              roomType={room.roomType}
              roomId={room._id}
              //   setOpenModal={setIsJoinStreamDialogOpen}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default CurrentlyLiveStreamSection;
