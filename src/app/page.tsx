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
];

export default function HomePage() {
  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold">AI Playground (Index)</h1>

      {INDEX.map((index) => (
        <div key={index.to}>
          <Link className="mb-4 text-xl" href={index.to}>
            {index.title}
          </Link>

          {index.children?.length ? (
            <ul className="border-border ml-2 border-l pl-2">
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
