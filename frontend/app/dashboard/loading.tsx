"use client";

import { ItemsSkeleton } from "@/components/dashboard/items-skeleton";
import { Card } from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";

export default function DashboardLoading() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10 space-y-6">
      <Card className="flex h-40 items-center justify-center">
        <Loader label="Loading dashboard..." />
      </Card>
      <ItemsSkeleton />
    </main>
  );
}
