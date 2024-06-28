"use server";

import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { createStreamableValue } from "ai/rsc";

export async function generate(question: string) {
  const stream = createStreamableValue("");

  (async () => {
    const { textStream } = await streamText({
      model: google("models/gemini-1.5-flash-latest"),
      prompt: question,
    });

    for await (const delta of textStream) {
      stream.update(delta);
    }

    stream.done();
  })();

  return { output: stream.value };
}
