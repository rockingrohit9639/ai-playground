"use server";

import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function continueConversation(messages: Message[]) {
  const { text } = await generateText({
    model: google("models/gemini-1.5-flash-latest"),
    system: "You are a very friendly and police assistant.",
    messages,
  });

  return {
    messages: [...messages, { role: "assistant" as const, content: text }],
  };
}
