import Link from "next/link";

type Index = {
  title: string;
  to: string;
  children?: Index[];
};

const INDEX: Index[] = [
  {
    title: "Basics",
    to: "/basics/generating-text",
    children: [
      {
        title: "Generating Text",
        to: "/basics/generating-text",
      },
      {
        title: "Stream text generation",
        to: "/basics/stream-text-generation",
      },
      {
        title: "Generating structured data",
        to: "/basics/generating-structured-data",
      },
      {
        title: "Generating object generation",
        to: "/basics/streaming-object-generation",
      },
    ],
  },
  {
    title: "Chat",
    to: "/chat/generate-chat-completion",
    children: [
      {
        title: "Generate chat completion",
        to: "/chat/generate-chat-completion",
      },
      {
        title: "Stream chat completion",
        to: "/chat/stream-chat-completion",
      },
    ],
  },
  {
    title: "Tools",
    to: "/tools/call-tool",
    children: [
      {
        title: "Call Tools",
        to: "/tools/call-tool",
      },
      {
        title: "Call tools in parallel",
        to: "/tools/call-tools-in-parallel",
      },
      {
        title: "Render interface during Tool Calls",
        to: "/tools/render-interface-during-tool-calls",
      },
    ],
  },
  {
    title: "State Management",
    to: "/state-management/ai-and-ui-states",
    children: [
      {
        title: "AI and UI States",
        to: "/state-management/ai-and-ui-states",
      },
      {
        title: "Save and Restore States",
        to: "/state-management/save-and-restore-states",
      },
    ],
  },
];

export default function HomePage() {
  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold">AI Playground (Index)</h1>

      {INDEX.map((index) => (
        <div key={index.to} className="mb-4">
          <Link className="mb-4 text-xl" href={index.to}>
            {index.title}
          </Link>

          {index.children?.length ? (
            <ul className="ml-2 border-l border-border pl-2">
              {index.children.map((childIndex) => (
                <li key={childIndex.to}>
                  <Link href={childIndex.to} className="text-sm">
                    {childIndex.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ))}
    </div>
  );
}
