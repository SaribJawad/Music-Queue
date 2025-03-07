import { motion } from "motion/react";
import Button from "../Button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWebSocketContext } from "../../contexts/webSocketProvider";
import { showToast } from "../../utils/showToast";

interface CreateStreamDialogProps {
  setIsOpen: (arg: boolean) => void;
  roomId: string;
}

const FormSchema = z.object({
  password: z.string().min(1, "Password is requried"),
});

type IFormData = z.infer<typeof FormSchema>;

function JoinStreamDialog({ setIsOpen, roomId }: CreateStreamDialogProps) {
  const { isConnected, sendMessage } = useWebSocketContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormData>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = (data: IFormData) => {
    const sent = sendMessage(
      { roomPassword: data.password, roomId },
      "JOIN_ROOM"
    );

    if (sent) {
      setIsOpen(false);
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
        className="z-10"
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 p-6 dark:bg-background_dark bg-background_light  rounded-md  "
        >
          <div>
            <label className="block text-sm font-medium">Passcode</label>
            <input
              {...register("password")}
              type="password"
              className="w-full p-2 outline-none rounded-md bg-background_light_secondary dark:bg-background_dark_secondary "
              placeholder="Enter passcode"
            />
            {errors.password && (
              <p className="text-xs text-red-700">{errors.password.message}</p>
            )}
          </div>
          <div className="flex  justify-center gap-2">
            <Button type="submit" size="sm">
              Join Room
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
