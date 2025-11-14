"use client";

import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

interface LoaderProps {
  label?: string;
  className?: string;
}

export const Loader = ({ label = "Loading...", className }: LoaderProps) => (
  <div
    className={cn(
      "flex items-center gap-3 rounded-3xl border border-border bg-card/90 px-6 py-4 text-sm font-semibold text-muted-foreground shadow-sm",
      className,
    )}
  >
    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
    {label}
  </div>
);
