"use server";

import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export async function getAnswer(question: string) {
  const { text, finishReason, usage } = await generateText({
    model: google("models/gemini-1.5-flash-latest"),
    prompt: question,
  });

  return { text, finishReason, usage };
}
