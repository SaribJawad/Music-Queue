import { z } from "zod";
import { LiveRoomSchema } from "../schemas/roomSchema";
import { useQuery } from "@tanstack/react-query";
import { ErrorType } from "../schemas/errorSchema";
import { api } from "../config/axios";
import { useAppDispatch } from "../app/hook";
import { useParams } from "react-router-dom";
import { setLiveRoom } from "../features/liveRoom/liveRoom.slice";
import { AxiosError } from "axios";

const UseGetLiveRoomResponseSchema = z.object({
  statusCode: z.number(),
  data: LiveRoomSchema,
  message: z.string(),
  success: z.boolean(),
});

type UseGetLiveRoomResponseType = z.infer<typeof UseGetLiveRoomResponseSchema>;

export const useGetLiveRoom = () => {
  const dispatch = useAppDispatch();
  const { roomId } = useParams();
  return useQuery<UseGetLiveRoomResponseType, ErrorType>({
    queryKey: ["liveRoom"],
    queryFn: async (): Promise<UseGetLiveRoomResponseType> => {
      try {
        const response = await api.get(`/room/${roomId}`);

        const parsedResponse = UseGetLiveRoomResponseSchema.safeParse(
          response.data
        );

        if (!parsedResponse.success) {
          let errMessage = parsedResponse.error.errors
            .map((err) => err)
            .join(", ");
          throw Error(errMessage);
        }

        dispatch(setLiveRoom(parsedResponse.data?.data!));

        return parsedResponse.data;
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
    refetchOnWindowFocus: false,
  });
};
