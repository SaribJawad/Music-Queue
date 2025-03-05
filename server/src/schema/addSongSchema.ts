import { z } from "zod";

const objectIdRegex = /^[a-f\d]{24}$/i;
const youtubeRegex =
  /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+(&.*)?$/;

export const extractedSongSchema = z.object({
  externalId: z.string().min(1, "External ID is required"),
  title: z.string().min(1, "Title is required"),
  coverImageUrl: z.string().url("Invalid cover image URL"),
  artist: z.string(),
  source: z.enum(["soundcloud", "youtube"]),
  room: z.string().regex(objectIdRegex, "Invalid MongoDB ObjectID"),
});

export const AddSongSchema = z.object({
  songUrl: z.string().regex(youtubeRegex),
  roomId: z.string().regex(objectIdRegex),
});
