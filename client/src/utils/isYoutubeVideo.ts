import { z } from "zod";

function isYoutubeVideo(url: string) {
  return z
    .string()
    .url()
    .refine((val) => val.startsWith("https://www.youtube.com/watch?v="), {
      message: "Invalid YouTube URL",
    })
    .safeParse(url).success;
}

export default isYoutubeVideo;
