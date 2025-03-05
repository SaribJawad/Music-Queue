import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "./Button";
import { useAppSelector } from "../app/hook";
import { selectRoomType } from "../features/liveRoom/liveRoom.slice";
import { showToast } from "../utils/showToast";
import { useWebSocketContext } from "../contexts/webSocketProvider";
import { useParams } from "react-router-dom";

const youtubeRegex =
  /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+(&.*)?$/;

const AddSongSchema = z.object({
  songUrl: z
    .string()
    .min(1, "URL is required")
    .refine((url) => youtubeRegex.test(url), {
      message: "Invalid YouTube URL",
    }),
});

function AddSongSection() {
  const { roomId } = useParams();
  const { sendMessage, isConnected } = useWebSocketContext();
  const roomType = useAppSelector(selectRoomType);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{ songUrl: string }>({
    resolver: zodResolver(
      roomType === "youtube"
        ? AddSongSchema
        : z.object({ songUrl: z.string().min(1, "URL is required") })
    ),
  });

  const handleAddSong = (data: { songUrl: string }) => {
    const sent = sendMessage({ ...data, roomId }, "ADD_SONG");

    if (sent) {
      showToast("success", "Video/song added");
      reset();
    } else if (isConnected) {
      console.warn(
        "Failed to send message even though connection is established"
      );
    } else {
      showToast("error", "Something went wrong! Try again.");
    }
  };

  return (
    <section className="flex  gap-2 flex-col">
      <form
        onSubmit={handleSubmit(handleAddSong)}
        className="w-full flex gap-2 items-center"
      >
        <div className="w-full">
          <input
            {...register("songUrl")}
            placeholder="Paste the URL here!"
            type="text"
            className="w-full p-2 outline-none rounded-md bg-background_light dark:bg-background_dark text-sm"
          />
        </div>
        <Button type="submit" size="sm" className="flex-shrink-0">
          Add Song
        </Button>
      </form>
      {errors.songUrl && (
        <p className="text-red-500 text-xs mt-1 text-start">
          {errors.songUrl.message}
        </p>
      )}
    </section>
  );
}

export default AddSongSection;
