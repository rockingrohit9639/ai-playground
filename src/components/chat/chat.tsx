import { type BaseProps } from "~/types/base";
import { cn } from "~/utils/utils";

type ChatProps = React.PropsWithChildren<BaseProps>;

export default function Chat({ className, style, children }: ChatProps) {
  return (
    <div className={cn("h-full w-full border-b", className)} style={style}>
      {children}

      <form className="absolute bottom-0 left-1/2 -translate-x-1/2">
        <input className="border-border w-full min-w-96 border bg-transparent px-4 py-2 outline-none" />
      </form>
    </div>
  );
}
