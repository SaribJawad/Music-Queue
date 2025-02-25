import { z } from "zod";

export const ServerMessageSchema = z.object({
  action: z.string(),
  payload: z.any(),
  error: z.string().optional(),
});
