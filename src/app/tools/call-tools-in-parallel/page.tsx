"use client";

import Chat from "~/components/chat";
import { continueConversation, type Message } from "./action";
import { useState } from "react";

// Force the page to be dynamic and allow streaming responses up to 30 seconds
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export default function CallTool() {
  const [conversation, setConversation] = useState<Message[]>([]);

  return (
    <Chat
      onSubmit={async (e) => {
        e.preventDefault();

        const message = String(new FormData(e.currentTarget).get("message"));

        const { messages } = await continueConversation([
          ...conversation,
          { role: "user", content: message },
        ]);

        setConversation(messages);
      }}
    >
      <h1 className="mb-2 text-2xl font-bold">Call Tools in Parallel</h1>

      <div>
        {conversation.map((message, index) => (
          <div key={index}>
            {message.role}: {message.content}
          </div>
        ))}
      </div>
    </Chat>
  );
}
