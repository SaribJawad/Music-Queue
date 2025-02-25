import { z } from "zod";

export const CreateRoomSchema = z.object({
  roomType: z.enum(["youtube", "soundcloud"], {
    errorMap: () => ({
      message: "Room type is required",
    }),
  }),
  roomName: z.string({ required_error: "Room name is required" }),
  roomPassword: z.string({ required_error: "Room password is required" }),
});
