"use client";

import { useActions, useUIState } from "ai/rsc";
import Chat from "~/components/chat";
import { type AI } from "./action";
import { generateId } from "ai";

// Force the page to be dynamic and allow streaming responses up to 30 seconds
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export default function SaveAndRestoreStates() {
  const [conversation, setConversation] = useUIState<typeof AI>();
  const { continueConversation } = useActions<typeof AI>();

  return (
    <Chat
      onSubmit={async (e) => {
        e.preventDefault();

        const input = String(new FormData(e.currentTarget).get("message"));

        setConversation((currentConversation) => [
          ...currentConversation,
          { id: generateId(), role: "user", display: input },
        ]);

        const message = await continueConversation(input);

        setConversation((currentConvo) => [...currentConvo, message]);
      }}
    >
      <h1 className="mb-4 text-2xl font-bold">Save and Restore States</h1>
      <div>
        {conversation.map((message) => (
          <div key={message.id}>
            {message.role}: {message.display}
          </div>
        ))}
      </div>
    </Chat>
  );
}
