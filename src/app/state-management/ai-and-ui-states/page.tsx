"use client";

import { useActions, useUIState } from "ai/rsc";
import { type AI, type ClientMessage } from "./action";
import Chat from "~/components/chat";
import { generateId } from "ai";

// Force the page to be dynamic and allow streaming responses up to 30 seconds
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export default function AIandUIStates() {
  const [conversation, setConversation] = useUIState<typeof AI>();
  const { continueConversation } = useActions<typeof AI>();

  return (
    <Chat
      onSubmit={async (e) => {
        e.preventDefault();
        const message = String(new FormData(e.currentTarget).get("message"));

        setConversation((currentConversation: ClientMessage[]) => [
          ...currentConversation,
          { id: generateId(), role: "user", display: message },
        ]);

        const clientMessage = await continueConversation(message);

        setConversation((currentConversation: ClientMessage[]) => [
          ...currentConversation,
          clientMessage,
        ]);
      }}
    >
      <h1 className="mb-4 text-2xl font-bold">AI and UI states</h1>
      <div>
        {conversation.map((message: ClientMessage) => (
          <div key={message.id}>
            {message.role}: {message.display}
          </div>
        ))}
      </div>
    </Chat>
  );
}
