"use client";

import { Toaster } from "sonner";

export const AppToaster = () => (
  <Toaster
    position="top-center"
    toastOptions={{
      classNames: {
        toast:
          "rounded-2xl border border-border bg-card/95 text-foreground shadow-lg",
        title: "font-semibold",
        description: "text-sm text-muted-foreground",
      },
    }}
  />
);
