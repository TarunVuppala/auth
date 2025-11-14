"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = {
  default:
    "bg-accent text-accent-foreground",
  secondary:
    "border border-border bg-color-badge-secondary-bg text-color-badge-secondary-foreground",
  outline: "border border-border text-foreground",
  success:
    "border border-transparent bg-color-badge-success-bg text-color-badge-success-foreground",
  destructive:
    "border border-transparent bg-color-badge-destructive-bg text-color-badge-destructive-foreground",
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
