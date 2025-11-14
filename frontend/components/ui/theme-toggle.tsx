"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  if (!resolvedTheme) {
    return null;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className="relative overflow-hidden rounded-full border border-[color:var(--border)] bg-[color:var(--card)]/80 text-[color:var(--foreground)] backdrop-blur transition"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      <Sun
        className={`h-5 w-5 text-amber-500 transition-transform duration-200 ${isDark ? "scale-0" : "scale-100"}`}
      />
      <Moon
        className={`absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 text-sky-400 transition-transform duration-200 ${isDark ? "scale-100" : "scale-0"}`}
      />
    </Button>
  );
}
