"use client";

import type { UseFormReturn } from "react-hook-form";

import type { Item, ItemFormValues } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ItemFormCard({
  form,
  isEditing,
  editingItem,
  onCancel,
  onSubmit,
}: {
  form: UseFormReturn<ItemFormValues>;
  isEditing: boolean;
  editingItem: Item | null;
  onCancel: () => void;
  onSubmit: (values: ItemFormValues) => Promise<void>;
}) {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          {isEditing ? "Update item" : "Add item"}
        </CardTitle>
        <CardDescription>
          {isEditing
            ? "You are updating an existing record."
            : "Create a quick note, task, or reminder."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isEditing && (
          <div className="mb-4 flex items-center justify-between rounded-2xl bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
            Editing {editingItem?.title ?? ""}
            <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        )}
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Quarterly planning" {...register("title")} />
            {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Optional context"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            <Button type="submit" className="rounded-full" disabled={isSubmitting}>
              {isEditing ? "Save changes" : "Create item"}
            </Button>
            {isEditing && (
              <Button type="button" variant="outline" className="rounded-full" onClick={onCancel}>
                Clear
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
