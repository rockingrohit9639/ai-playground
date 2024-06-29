"use server";

import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

export async function getNotifications(input: string) {
  const {
    object: { notifications },
  } = await generateObject({
    model: google("models/gemini-1.5-flash-latest"),
    system: "You generate three notifications for a messages app.",
    prompt: input,
    schema: z.object({
      notifications: z.array(
        z.object({
          name: z.string().describe("Name of a fictional person."),
          message: z.string().describe("Do not use emojis or links."),
          minutesAgo: z.number(),
        }),
      ),
    }),
  });

  return { notifications };
}
