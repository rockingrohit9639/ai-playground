import { z } from "zod";

export const serverMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string(),
});
