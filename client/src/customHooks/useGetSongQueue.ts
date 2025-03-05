import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { SongSchema } from "../schemas/songSchema";
import { ErrorType } from "../schemas/errorSchema";
import { useAppDispatch } from "../app/hook";
import { useParams } from "react-router-dom";
import { AxiosError } from "axios";
import { api } from "../config/axios";
import { setSongQueue } from "../features/song/song.slice";

const GetSongQueueResponseSchema = z.object({
  statusCode: z.number(),
  data: z.array(SongSchema),
  message: z.string(),
  success: z.boolean(),
});

type SongQueueResponseType = z.infer<typeof GetSongQueueResponseSchema>;

export const useGetSongQueue = () => {
  const dispatch = useAppDispatch();
  const { roomId } = useParams();
  //   console.log(roomId);
  return useQuery<SongQueueResponseType, ErrorType>({
    queryKey: ["songQueue"],
    queryFn: async (): Promise<SongQueueResponseType> => {
      try {
        const response = await api.get(`/room/song-queue/${roomId}`);
        const parsedResponse = GetSongQueueResponseSchema.parse(response.data);

        dispatch(setSongQueue(parsedResponse.data));

        return parsedResponse;
      } catch (error) {
        let errMessage = "Something went wrong while getting live room";

        if (error instanceof AxiosError) {
          errMessage =
            error.response?.data.message || error.message || errMessage;
        } else if (error instanceof Error) {
          errMessage = error.message;
        }
        throw errMessage;
      }
    },
    enabled: !!roomId,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};
