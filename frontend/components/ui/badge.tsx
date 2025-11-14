"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = {
  default:
    "bg-[color:var(--accent)] text-[color:var(--accent-foreground)]",
  secondary:
    "border border-[color:var(--border)] bg-[color:var(--color-badge-secondary-bg)] text-[color:var(--color-badge-secondary-foreground)]",
  outline: "border border-[color:var(--border)] text-[color:var(--foreground)]",
  success:
    "border border-transparent bg-[color:var(--color-badge-success-bg)] text-[color:var(--color-badge-success-foreground)]",
  destructive:
    "border border-transparent bg-[color:var(--color-badge-destructive-bg)] text-[color:var(--color-badge-destructive-foreground)]",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof badgeVariants;
}

export const Badge = ({
  className,
  variant = "default",
  ...props
}: BadgeProps) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
      badgeVariants[variant],
      className,
    )}
    {...props}
  />
);
