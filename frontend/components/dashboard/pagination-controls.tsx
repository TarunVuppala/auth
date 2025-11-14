"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPrevious: () => void;
  onNext: () => void;
}

export const PaginationControls = ({
  currentPage,
  totalPages,
  totalItems,
  onPrevious,
  onNext,
}: PaginationControlsProps) => (
  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-[color:var(--muted-foreground)]">
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onPrevious}
      disabled={currentPage === 1}
      className="gap-1 rounded-full"
    >
      <ChevronLeft className="h-4 w-4" />
      Previous
    </Button>
    <p>
      Page {currentPage} of {totalPages} • {totalItems} items
    </p>
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onNext}
      disabled={currentPage === totalPages}
      className="gap-1 rounded-full"
    >
      Next
      <ChevronRight className="h-4 w-4" />
    </Button>
  </div>
);
