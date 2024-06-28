"use client";

import { useState } from "react";
import Button from "~/components/button";
import { generate } from "./actions";
import { readStreamableValue } from "ai/rsc";

// Force the page to be dynamic and allow streaming responses up to 30 seconds
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export default function StreamTextGeneration() {
  const [generation, setGeneration] = useState<string>("");

  return (
    <div className="relative h-full w-full">
      <h1 className="mb-4 text-2xl font-bold">Generating text</h1>

      <Button
        className="mb-4"
        onClick={async () => {
          const { output } = await generate("Why is the sky blue?");

          for await (const delta of readStreamableValue(output)) {
            setGeneration(
              (currentGeneration) => `${currentGeneration}${delta}`,
            );
          }
        }}
      >
        Answer
      </Button>

      <div>{generation}</div>
    </div>
  );
}
