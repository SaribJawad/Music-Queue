import { z } from "zod";

const objectIdRegex = /^[a-f\d]{24}$/i;

export const addSongSchema = z.object({
  externalId: z.string().min(1, "External ID is required"),
  title: z.string().min(1, "Title is required"),
  coverImageUrl: z.string().url("Invalid cover image URL"),
  artist: z.string(),
  source: z.enum(["soundcloud", "youtube"]),
  stream: z.string().regex(objectIdRegex, "Invalid MongoDB ObjectID"),
});
