"use server";

import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { z } from "zod";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function continueConversation(history: Message[]) {
  const { text, toolResults } = await generateText({
    model: google("models/gemini-1.5-flash-latest"),
    system: "You are a very friendly assistant",
    messages: history,
    tools: {
      celsiusToFahrenheit: {
        description: "Converts celsius to fahrenheit",
        parameters: z.object({
          value: z.string().describe("The value in celsius"),
        }),
        execute: async ({ value }) => {
          const celsius = parseFloat(value as string);
          const fahrenheit = celsius * (9 / 5) + 32;

          return `${celsius}°C is ${fahrenheit.toFixed(2)}°F`;
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
