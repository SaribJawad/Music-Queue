import Button from "./Button";

interface LiveStreamListProps {
  setOpenModal: (arg: boolean) => void;
}

function LiveStreamList({ setOpenModal }: LiveStreamListProps) {
  return (
    <div className="w-full  flex items-center justify-between ">
      <div className="flex flex-col">
        <h3 className="sm:text-base text-sm text-text_dark_secondary dark:text-text_dark">
          Sarib's stream
        </h3>
        <span className="text-xs dark:border-l-text_dark">Youtube</span>
      </div>
      <Button onClick={() => setOpenModal(true)} size="sm">
        Join
      </Button>
    </div>
  );
}

export default LiveStreamList;
