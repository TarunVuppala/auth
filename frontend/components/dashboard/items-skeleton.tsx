"use client";

import { Skeleton } from "@/components/ui/skeleton";

export const ItemsSkeleton = () => (
  <div className="mt-6 space-y-4">
    <Skeleton className="h-5 w-1/3" />
    <div className="space-y-3 rounded-3xl border border-border bg-card/80 p-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="flex flex-wrap items-center gap-4 border-b border-border pb-3 last:border-none"
        >
          <Skeleton className="h-4 w-1/4 min-w-[120px]" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
      ))}
    </div>
  </div>
);
