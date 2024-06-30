import { type FormEvent } from "react";
import { type BaseProps } from "~/types/base";
import { cn } from "~/utils/utils";

type ChatProps = React.PropsWithChildren<
  BaseProps & {
    onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
  }
>;

export default function Chat({
  className,
  style,
  children,
  onSubmit,
}: ChatProps) {
  return (
    <div className={cn("h-full w-full border-b", className)} style={style}>
      {children}

      <form
        className="absolute bottom-4 left-1/2 -translate-x-1/2"
        onSubmit={onSubmit}
      >
        <input
          className="w-full min-w-96 border border-border bg-transparent px-4 py-2 outline-none"
          name="message"
          placeholder="enter your message"
        />
      </form>
    </div>
  );
}
