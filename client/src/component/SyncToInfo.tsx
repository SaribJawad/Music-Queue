import { useAppSelector } from "../app/hook";
import { selectJoinedusersTimestamps } from "../features/liveRoom/liveRoom.slice";
import { formatTimestamps } from "../utils/formatTimestamps";

interface SyncToInfoProps {
  isOpen: boolean;
  handleSyncAll: (timestamps?: number) => void;
}

function SyncToInfo({ isOpen, handleSyncAll }: SyncToInfoProps) {
  const joinedUserTimestamps = useAppSelector(selectJoinedusersTimestamps);

  return (
    <div
      className={`${
        isOpen ? "static" : "hidden"
      } bg-zinc-900 opacity-80 h-full w-full p-1 absolute top-0 left-0 overflow-auto flex flex-col gap-2 text-white`}
    >
      <h1 className="font-semibold text-sm md:text-lg">Sync To</h1>

      {joinedUserTimestamps.map((entry) => (
        <button
          onClick={() => handleSyncAll(entry.timestamps)}
          key={entry.userId}
          className="md:text-sm text-xs flex gap-3 cursor-pointer hover:text-white text-zinc-300"
        >
          <h2>{entry.username}</h2>
          <p>{formatTimestamps(entry.timestamps)}</p>
        </button>
      ))}
    </div>
  );
}

export default SyncToInfo;
