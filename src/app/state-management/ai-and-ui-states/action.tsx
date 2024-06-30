"use server";

import { google } from "@ai-sdk/google";
import { generateId } from "ai";
import { createAI, getMutableAIState, streamUI } from "ai/rsc";

export interface ServerMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ClientMessage {
  id: string;
  role: "user" | "assistant";
  display: React.ReactNode;
}

export async function continueConversation(
  input: string,
): Promise<ClientMessage> {
  const history = getMutableAIState();

  const messages = history.get() as ServerMessage[];

  const result = await streamUI({
    model: google("models/gemini-1.5-flash-latest"),
    messages: [...messages, { role: "user", content: input }],
    text: ({ content, done }) => {
      if (done) {
        history.done((messages: ServerMessage[]) => [
          ...messages,
          { role: "assistant", content },
        ]);
      }

      return <div>{content}</div>;
    },
  });

  return {
    id: generateId(),
    role: "assistant",
    display: result.value,
  };
}

export const AI = createAI<
  ServerMessage[],
  ClientMessage[],
  { continueConversation: (input: string) => Promise<ClientMessage> }
>({
  actions: {
    continueConversation,
  },
  initialAIState: [],
  initialUIState: [],
});
