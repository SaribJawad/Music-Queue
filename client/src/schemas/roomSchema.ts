import { z } from "zod";

export const RoomSchema = z.object({
  _id: z.string(),
  roomType: z.string(),
  roomName: z.string(),
  owner: z.object({
    _id: z.string(),
    name: z.string(),
    email: z.string().email(),
    avatar: z.string(),
  }),
});

export type RoomType = z.infer<typeof RoomSchema>;
