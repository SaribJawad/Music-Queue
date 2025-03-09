import { z } from "zod";
import { objectIdRegex } from "./userSchema";

export const SongSchema = z.object({
  externalId: z.string(),
  title: z.string(),
  coverImageUrl: z.string(),
  artist: z.string(),
  source: z.string(),
  vote: z.array(z.string().regex(objectIdRegex).optional()),
  noOfVote: z.number(),
  room: z.string().regex(objectIdRegex),
  _id: z.string().regex(objectIdRegex),
});

export type SongType = z.infer<typeof SongSchema>;
