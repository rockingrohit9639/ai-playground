"use server";

import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { createStreamableUI } from "ai/rsc";
import { z } from "zod";
import Weather from "./weather";

export interface Message {
  role: "user" | "assistant";
  content: string;
  display?: React.ReactNode;
}

export async function continueConversation(history: Message[]) {
  const stream = createStreamableUI();

  const { text, toolResults } = await generateText({
    model: google("models/gemini-1.5-flash-latest"),
    system: "You are a friendly weather assistant!",
    messages: history,
    tools: {
      showWeather: {
        description: "Show the weather for the given location.",
        parameters: z.object({
          city: z.string().describe("This city to show the weather for."),
          unit: z
            .enum(["C", "F"])
            .describe("This unit to display the temperature in"),
        }),
        execute: async ({ city, unit }) => {
          stream.done(<Weather city={city as string} unit={unit as string} />);
          return `Here's the weather for ${city}!`;
        },
      },
    },
  });

  return {
    messages: [
      ...history,
      {
        role: "assistant" as const,
        content:
          text || toolResults.map((toolResult) => toolResult.result).join(),
        display: stream.value,
      },
    ],
  };
}
