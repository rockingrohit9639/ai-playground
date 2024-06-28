import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cloneElement, forwardRef } from "react";
import { cn } from "~/utils/utils";
import Spinner from "../spinner";

export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        destructive: "bg-error text-primary hover:bg-error/90",
        outline:
          "border border-border border-dashed hover:bg-muted-foreground/10",
        ghost: "hover:bg-muted-foreground/10",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 space-x-1 rounded-md px-2 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9 justify-center",
        "icon-sm": "h-8 w-8 justify-center",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const iconVariants = cva("flex-shrink-0", {
  variants: {
    type: {
      withChildren: "!h-4 !w-4",
      withoutChildren: "block !h-4 !w-4",
    },
  },
  defaultVariants: {
    type: "withChildren",
  },
});

export interface BaseButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export type ButtonProps = Omit<BaseButtonProps, "asChild"> & {
  loading?: boolean;
  icon?: React.ReactElement<{ className?: string }>;
  iconPosition?: "left" | "right";
};

const BaseButton = forwardRef<HTMLButtonElement, BaseButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    );
  },
);
BaseButton.displayName = "BaseButton";

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ loading, icon, iconPosition = "left", children, ...props }, ref) => {
    const iconElement = icon
      ? cloneElement(icon, {
          className: cn(
            iconVariants({
              type: children ? "withChildren" : "withoutChildren",
            }),
            icon.props.className,
            "text-current",
          ),
        })
      : null;

    return (
      <BaseButton {...props} asChild={false} data-loading={loading} ref={ref}>
        {loading ? (
          <Spinner
            className={cn(
              iconVariants({
                type: children ? "withChildren" : "withoutChildren",
              }),
              "mr-2 text-current",
            )}
          />
        ) : (
          iconPosition === "left" && iconElement
        )}
        {children ? <span>{children}</span> : null}
        {iconPosition === "right" && iconElement}
      </BaseButton>
    );
  },
);

Button.displayName = "Button";

export default Button;
