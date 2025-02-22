import { z } from "zod";

export const ErrorSchema = z.object({
  statusCode: z.number(),
  message: z.string(),
  success: z.boolean(z.literal(false)),
  stack: z.string().optional(),
});

export type ErrorType = z.infer<typeof ErrorSchema>;
