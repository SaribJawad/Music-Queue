import { motion } from "motion/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Button from "../Button";
import { z } from "zod";

interface CreateStreamDialogProps {
  setIsOpen: (arg: boolean) => void;
  handleCreateRoom: (roomName: string, roomPassword: string) => void;
}

const FormSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be atleast greater than 3 characters")
    .max(15, "Name must not be greater than 15 characters"),
  password: z
    .string()
    .min(3, "Password must be atleast greater than 3 characters")
    .max(16, "Password must not be greater than 16 characters"),
});

type IFormInput = z.infer<typeof FormSchema>;

const CreateStreamDialog = ({
  setIsOpen,
  handleCreateRoom,
}: CreateStreamDialogProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({ resolver: zodResolver(FormSchema) });

  const onSubmit = (data: IFormInput) => {
    handleCreateRoom(data.name, data.password);
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
            <label className=" text-sm font-medium">Room Name</label>
            <input
              {...register("name")}
              type="text"
              className="w-full p-2 outline-none rounded-md bg-background_light_secondary dark:bg-background_dark_secondary   "
              placeholder="Enter room name"
            />
            {errors.name && (
              <p className="text-xs text-red-700">{errors.name.message}</p>
            )}
          </div>

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
              Create Room
            </Button>
            <Button onClick={() => setIsOpen(false)} type="button" size="sm">
              Cancel
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default CreateStreamDialog;
