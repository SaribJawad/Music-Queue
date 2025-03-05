import { z } from "zod";
import { SongSchema } from "./songSchema";

export const RoomSchema = z.object({
  _id: z.string(),
  roomType: z.enum(["youtube", "soundcloud"]),
  roomName: z.string(),
  users: z.array(z.string()),
  owner: z.object({
    _id: z.string(),
    name: z.string(),
    email: z.string().email(),
    avatar: z.string(),
  }),
});

export type RoomType = z.infer<typeof RoomSchema>;

export const LiveRoomSchema = RoomSchema.extend({
  currentSong: SongSchema.or(z.null()),
});

export type LiveRoomType = z.infer<typeof LiveRoomSchema>;
