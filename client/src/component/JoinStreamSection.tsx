import { useStreamContext } from "../contexts/streamContext";
import Button from "./Button";
import LoadingBar from "./ui/LoadingBar";

function JoinStreamSection() {
  const { allStreams, isAllStreamsLoading } = useStreamContext();
  return (
    <div className="dark:bg-background_dark_secondary bg-background_light_secondary rounded-md p-4 flex flex-col gap-4 h-[500px]">
      <h1 className="dark:text-white text-text_light text-xl sm:text-2xl font-semibold text-center ">
        choose stream section
      </h1>
      {isAllStreamsLoading ? (
        <div className="w-full h-full flex items-center justify-center">
          <LoadingBar />
        </div>
      ) : allStreams.length <= 0 && !isAllStreamsLoading ? (
        <p className="text-center">No streams available right now</p>
      ) : (
        <div className="flex flex-col gap-3 overflow-auto">
          {allStreams.map((stream) => (
            <div
              key={stream._id}
              className="dark:bg-background_dark bg-background_light text-text_light dark:text-text_dark  p-4 flex items-center justify-between rounded-md w-full gap-4"
            >
              <h1>{stream.owner.name}'s stream</h1>
              <Button size="sm">Join Stream</Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default JoinStreamSection;
