import { db } from "~/server/db";
import { AI } from "./action";
import { z } from "zod";
import { serverMessageSchema } from "./schema";

export default async function SaveAndRestoreStatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const conversation = await db.conversation.findFirst();

  return (
    <AI
      initialAIState={
        !conversation
          ? []
          : z.array(serverMessageSchema).parse(conversation.messages)
      }
      initialUIState={[]}
    >
      {children}
    </AI>
  );
}
