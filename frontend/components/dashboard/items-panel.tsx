"use client";

import clsx from "clsx";
import { useEffect, useRef } from "react";
import { Inbox, PenSquare, RotateCcw, Search as SearchIcon, Trash2, XCircle } from "lucide-react";

import type { Item, Pagination, UserRole } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ItemsSkeleton } from "@/components/dashboard/items-skeleton";
import { PaginationControls } from "@/components/dashboard/pagination-controls";

interface LoadingState {
  loading: boolean;
  hasLoaded: boolean;
}

interface SearchControls {
  value: string;
  onChange: (value: string) => void;
  onRefresh: () => void;
}

interface SelectionState {
  hasSelection: boolean;
  bulkDeleting: boolean;
  selectedCount: number;
  onBulkDelete: () => Promise<void> | void;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  allSelected: boolean;
  someSelected: boolean;
  currentPageIds: string[];
}

interface PaginationState {
  pagination: Pagination | null;
  currentPage: number;
  onPrevious: () => void;
  onNext: () => void;
}

interface ItemsPanelProps {
  userRole: UserRole;
  items: Item[];
  loadingState: LoadingState;
  search: SearchControls;
  selection: SelectionState;
  paginationState: PaginationState;
  onEdit: (item: Item) => void;
  onDelete: (id: string) => Promise<void> | void;
  editingItemId: string | null;
}

export function ItemsPanel({
  userRole,
  items,
  loadingState,
  search,
  selection,
  paginationState,
  onEdit,
  onDelete,
  editingItemId,
}: ItemsPanelProps) {
  const headerCheckboxRef = useRef<HTMLInputElement | null>(null);
  const { loading, hasLoaded } = loadingState;
  const { value: searchValue, onChange: onSearchChange, onRefresh } = search;
  const {
    hasSelection,
    bulkDeleting,
    selectedCount,
    onBulkDelete,
    selectedIds,
    onToggleSelect,
    onToggleSelectAll,
    allSelected,
    someSelected,
    currentPageIds,
  } = selection;
  const { pagination, currentPage, onPrevious, onNext } = paginationState;

  useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = !allSelected && someSelected;
    }
  }, [allSelected, someSelected]);

  return (
    <Card className="lg:col-span-3">
      <CardHeader className="space-y-2">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Items</CardTitle>
            <CardDescription>
              {userRole === "admin"
                ? "Admins see every record on the platform."
                : "Only your items are listed here."}
            </CardDescription>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <div className="relative flex-1 min-w-[220px]">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--muted-foreground)]" />
              <Input
                placeholder="Search items"
                value={searchValue}
                className="pl-9"
                onChange={(event) => onSearchChange(event.target.value)}
              />
              {searchValue.length > 0 && (
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--muted-foreground)] transition hover:opacity-80"
                  onClick={() => onSearchChange("")}
                  aria-label="Clear search"
                >
                  <XCircle className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button type="button" variant="outline" className="rounded-full gap-2" onClick={onRefresh}>
              <RotateCcw className={clsx("h-4 w-4", loading && hasLoaded ? "animate-spin" : undefined)} />
              Refresh
            </Button>
            {hasSelection && (
              <Button
                type="button"
                variant="destructive"
                className="rounded-full"
                disabled={bulkDeleting}
                onClick={() => {
                  void onBulkDelete();
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {bulkDeleting ? "Deleting..." : `Delete (${selectedCount})`}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading && !hasLoaded ? (
          <ItemsSkeleton />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <input
                      type="checkbox"
                      ref={headerCheckboxRef}
                      checked={allSelected && currentPageIds.length > 0}
                      onChange={onToggleSelectAll}
                      disabled={currentPageIds.length === 0}
                      className="size-4 rounded border-[color:var(--border)] bg-[color:var(--card)]"
                    />
                  </TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  {userRole === "admin" && <TableHead>Owner</TableHead>}
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={userRole === "admin" ? 5 : 4}
                      className="py-10 text-center text-sm text-[color:var(--muted-foreground)]"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Inbox className="h-6 w-6" />
                        <span>No items yet. Create one to get started.</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((item) => {
                    const isSelected = selectedIds.includes(item.id);
                    const isRowEditing = editingItemId === item.id;
                    return (
                      <TableRow
                        key={item.id}
                        className={clsx(
                          "border-b border-[color:var(--border)]/70 text-sm text-[color:var(--foreground)] last:border-none",
                          isRowEditing && "border-emerald-200 bg-emerald-50/70",
                          !isRowEditing && isSelected && "bg-[color:var(--card)]/60",
                        )}
                      >
                        <TableCell className="w-10">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => onToggleSelect(item.id)}
                            className="size-4 rounded border-[color:var(--border)] bg-[color:var(--card)]"
                          />
                        </TableCell>
                        <TableCell className="font-semibold text-[color:var(--foreground)]">
                          {item.title}
                        </TableCell>
                        <TableCell className="text-[color:var(--muted-foreground)]">
                          {item.description || "—"}
                        </TableCell>
                        {userRole === "admin" && (
                          <TableCell>
                            {item.ownerDetails ? (
                              <div className="space-y-1">
                                <div className="font-medium text-[color:var(--foreground)]">
                                  {item.ownerDetails.name || "Unknown"}
                                </div>
                                {item.ownerDetails.email && (
                                  <p className="text-xs text-[color:var(--muted-foreground)]">
                                    {item.ownerDetails.email}
                                  </p>
                                )}
                                <Badge variant="outline">
                                  {item.ownerDetails.role?.toString().toUpperCase() ?? "USER"}
                                </Badge>
                              </div>
                            ) : (
                              "—"
                            )}
                          </TableCell>
                        )}
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="rounded-full gap-1"
                              onClick={() => onEdit(item)}
                            >
                              <PenSquare className="h-4 w-4" />
                              Edit
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="rounded-full text-red-500"
                              onClick={() => {
                                void onDelete(item.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {pagination && pagination.totalPages > 1 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            onPrevious={onPrevious}
            onNext={onNext}
          />
        )}
      </CardContent>
    </Card>
  );
}
