import { motion } from "motion/react";
import Button from "../Button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWebSocketContext } from "../../contexts/webSocketProvider";
import { showToast } from "../../utils/showToast";
import { useAppSelector } from "../../app/hook";
import { selectUserInfo } from "../../features/auth/auth.slice";
import { useLoadingContext } from "../../contexts/loadingActionProvider";
import LoadingBar from "./LoadingBar";

interface CreateStreamDialogProps {
  setIsOpen: (arg: boolean) => void;
  roomId: string;
}

const FormSchema = z.object({
  password: z.string().min(1, "Password is requried"),
});

type IFormData = z.infer<typeof FormSchema>;

function JoinStreamDialog({ setIsOpen, roomId }: CreateStreamDialogProps) {
  const { isLoading, startLoading } = useLoadingContext();
  const { isConnected, sendMessage } = useWebSocketContext();
  const loggedInUser = useAppSelector(selectUserInfo);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormData>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = (data: IFormData) => {
    startLoading("joinRoom");
    const sent = sendMessage(
      { roomPassword: data.password, roomId, userId: loggedInUser!._id },
      "JOIN_ROOM"
    );

    if (sent) {
      return;
    } else if (isConnected) {
      console.warn(
        "Failed to send message even though connection is established"
      );
    } else {
      showToast("error", "Something went wrong! Try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => {
        setIsOpen(false);
      }}
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2  -translate-y-1/2 h-full   flex items-center justify-center bg-[#0000007e]  z-1 w-full"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{ ease: "backInOut" }}
        onClick={(e) => e.stopPropagation()}
        className="z-10 dark:border dark:border-zinc-800 rounded-lg"
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 p-6 dark:bg-background_dark bg-background_light  rounded-md  "
        >
          <div className="flex flex-col gap-1">
            <label className="block text-sm font-medium">Passcode</label>
            <input
              {...register("password")}
              type="password"
              className="w-full md:text-base text-sm  p-2 outline-none rounded-md bg-background_light_secondary dark:bg-background_dark_secondary "
              placeholder="Enter passcode"
            />
            {errors.password && (
              <p className="text-xs text-red-700">{errors.password.message}</p>
            )}
          </div>
          <div className="flex  justify-center gap-2">
            <Button type="submit" size="sm">
              {isLoading("joinRoom") ? <LoadingBar size="xs" /> : "Join Room"}
            </Button>
            <Button onClick={() => setIsOpen(false)} type="button" size="sm">
              Cancel
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default JoinStreamDialog;
