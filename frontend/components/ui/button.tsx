"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[color:var(--accent)] disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        default:
          "bg-[color:var(--accent)] text-[color:var(--accent-foreground)] shadow-sm hover:opacity-90 dark:shadow-zinc-900/30",
        secondary:
          "border border-[color:var(--border)] bg-[color:var(--card)] text-[color:var(--card-foreground)] shadow-sm hover:bg-[color:var(--card)]/90",
        outline:
          "border border-[color:var(--border)] bg-transparent text-[color:var(--foreground)] hover:bg-[color:var(--border)]/40",
        ghost:
          "text-muted-foreground hover:bg-[color:var(--border)]/30",
        destructive:
          "bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-500",
      },
      size: {
        default: "px-5 py-2.5",
        sm: "px-4 py-2 text-xs",
        lg: "px-6 py-3 text-base",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          "focus-visible:ring-offset-0 dark:focus-visible:ring-offset-0",
          buttonVariants({ variant, size, className }),
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
