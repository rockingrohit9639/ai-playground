"use client";

import { useState } from "react";
import Chat from "~/components/chat";
import { continueConversation, type Message } from "./action";
import { readStreamableValue } from "ai/rsc";

// Force the page to be dynamic and allow streaming responses up to 30 seconds
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export default function StreamChatCompletion() {
  const [conversation, setConversation] = useState<Message[]>([]);

  return (
    <Chat
      onSubmit={async (e) => {
        e.preventDefault();
        const message = String(new FormData(e.currentTarget).get("message"));

        const { messages, newMessage } = await continueConversation([
          ...conversation,
          { role: "user", content: message },
        ]);

        let textContent = "";

        for await (const delta of readStreamableValue(newMessage)) {
          textContent = `${textContent}${delta}`;

          setConversation([
            ...messages,
            { role: "assistant", content: textContent },
          ]);
        }
      }}
    >
      <h1 className="mb-2 text-2xl font-bold">Generate chat completion</h1>

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
