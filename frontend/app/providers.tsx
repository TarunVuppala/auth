"use client";

import { ThemeProvider } from "next-themes";
import { useEffect, useRef } from "react";

import { AppToaster } from "@/components/ui/toaster";
import { useAuthStore } from "@/store/auth-store";

const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const hydrate = useAuthStore((state) => state.hydrate);
  const bootstrapped = useRef(false);

  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;
    void hydrate();
  }, [hydrate]);

  return <>{children}</>;
};

export const Providers = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
    <AuthInitializer>
      {children}
      <AppToaster />
    </AuthInitializer>
  </ThemeProvider>
);
