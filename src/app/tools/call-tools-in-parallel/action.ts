"use server";

import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { z } from "zod";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

function getWeather({ city, unit }: any) {
  // This function would normally make an
  // API request to get the weather.

  return { value: 25, description: "Sunny" };
}

export async function continueConversation(history: Message[]) {
  "use server";

  const { text, toolResults } = await generateText({
    model: google("models/gemini-1.5-flash-latest"),
    system: "You are a friendly weather assistant!",
    messages: history,
    tools: {
      getWeather: {
        description: "Get the weather for a location",
        parameters: z.object({
          city: z.string().describe("The city to get the weather for"),
          unit: z
            .enum(["C", "F"])
            .describe("The unit to display the temperature in"),
        }),
        execute: async ({ city, unit }) => {
          const weather = getWeather({ city, unit });
          return `It is currently 25°${weather.value} and ${weather.description} in ${city}!`;
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
          text || toolResults.map((toolResult) => toolResult.result).join("\n"),
      },
    ],
  };
}
