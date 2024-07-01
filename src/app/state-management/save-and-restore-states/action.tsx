"use server";

import { google } from "@ai-sdk/google";
import { generateId } from "ai";
import { createAI, getAIState, getMutableAIState, streamUI } from "ai/rsc";
import { db } from "~/server/db";

export type ServerMessage = {
  role: "user" | "assistant";
  content: string;
};

export type ClientMessage = {
  id: string;
  role: "user" | "assistant";
  display: React.ReactNode;
};

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
          { role: "user", content: input },
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
  onSetAIState: async ({ state, done }) => {
    if (done) {
      const conversation = await db.conversation.findFirst();

      if (!conversation) {
        await db.conversation.create({
          data: {
            name: "Very important",
            messages: state,
          },
        });

        return;
      }

      /** Setting messages in conversation */
      await db.conversation.update({
        where: { id: conversation.id },
        data: { messages: state },
      });
    }
  },
  onGetUIState: async () => {
    // we can get AI state here can generate UI state accordingly
    const history = getAIState() as ServerMessage[];

    return history.map(({ role, content }) => ({
      id: generateId(),
      role,
      display: <div>{content}</div>,
    }));
  },
});
