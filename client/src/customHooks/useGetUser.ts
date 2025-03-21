import { useQuery } from "@tanstack/react-query";

import { api } from "../config/axios";
import { z } from "zod";
import { UserSchema } from "../schemas/userSchema";
import { AxiosError } from "axios";
import { ErrorType } from "../schemas/errorSchema";
import { useAppDispatch } from "../app/hook";
import {
  setAuthFailure,
  setAuthStart,
  setAuthSuccess,
} from "../features/auth/auth.slice";

const GetUserResponseSchema = z.object({
  statusCode: z.number(),
  data: UserSchema,
  message: z.string(),
  success: z.boolean(),
});

type GetUserResponse = z.infer<typeof GetUserResponseSchema>;

export const useGetUser = () => {
  const dispatch = useAppDispatch();

  const query = useQuery<GetUserResponse, AxiosError<ErrorType>>({
    queryKey: ["user"],
    queryFn: async (): Promise<GetUserResponse> => {
      dispatch(setAuthStart());
      try {
        const response = await api.get("/auth/get-user", {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2M4MWVlYWViMWYyYzhkZjFjZjVhNmMiLCJnb29nbGVJZCI6IjExMDg5NDgwMDA5OTE3MTQ3NzMwOSIsImVtYWlsIjoic2FyaWJzcGFtQGdtYWlsLmNvbSIsIm5hbWUiOiJST0ZMIExNQU9sT0wiLCJpYXQiOjE3NDI1MjE5NzIsImV4cCI6MTc0MjYwODM3Mn0.0l9nDf-4iC2e6UuJLE7uCQKuk19sz9-qoIDFYAU3uaY`,
          },
        });

        const parsedData = GetUserResponseSchema.parse(response.data);

        dispatch(setAuthSuccess(parsedData.data));

        return parsedData;
      } catch (error) {
        let errorMessage = "Something went wrong getting user data";

        if (error instanceof AxiosError) {
          errorMessage =
            error.response?.data?.message || error.message || errorMessage;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }

        dispatch(setAuthFailure(errorMessage));
        throw error;
      }
    },
    retry: 0,
    retryOnMount: false,
    refetchOnWindowFocus: false,
  });

  return location.pathname === "/"
    ? { data: null, isLoading: false, error: null }
    : query;
};
