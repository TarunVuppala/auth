"use client";

import { Loader } from "@/components/ui/loader";

export default function AppLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <Loader label="Preparing experience..." />
    </main>
  );
}
