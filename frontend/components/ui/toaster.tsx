"use client";

import { Toaster } from "sonner";

export const AppToaster = () => (
  <Toaster
    position="top-center"
    toastOptions={{
      classNames: {
        toast:
          "rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)]/95 text-[color:var(--foreground)] shadow-lg",
        title: "font-semibold",
        description: "text-sm text-[color:var(--muted-foreground)]",
      },
    }}
  />
);
