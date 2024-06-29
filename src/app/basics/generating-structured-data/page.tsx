"use client";

import { useState } from "react";
import Button from "~/components/button";
import { getNotifications } from "./action";

// Force the page to be dynamic and allow streaming responses up to 30 seconds
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export default function GeneratingStructuredData() {
  const [generation, setGeneration] = useState<string>("");

  return (
    <div>
      <Button
        onClick={async () => {
          const { notifications } = await getNotifications(
            "Messages during finals week.",
          );

          setGeneration(JSON.stringify(notifications, null, 2));
        }}
      >
        View Notifications
      </Button>

      <pre>{generation}</pre>
    </div>
  );
}
