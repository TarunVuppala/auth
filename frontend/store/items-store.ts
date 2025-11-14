"use client";

import { create } from "zustand";
import { toast } from "sonner";

import { itemsApi } from "@/lib/api";
import type { Item, ItemFormValues, Pagination } from "@/lib/types";

type ItemMutationResult = "created" | "updated";

interface ItemsStore {
  items: Item[];
  pagination: Pagination | null;
  currentPage: number;
  searchInput: string;
  activeSearch: string;
  loadingItems: boolean;
  hasLoadedItems: boolean;
  editingItem: Item | null;
  selectedIds: string[];
  bulkDeleting: boolean;
  setSearchInput: (value: string) => void;
  setEditingItem: (item: Item | null) => void;
  fetchItems: (page?: number, search?: string) => Promise<void>;
  persistItem: (values: ItemFormValues) => Promise<ItemMutationResult>;
  removeItem: (id: string) => Promise<void>;
  toggleSelection: (id: string) => void;
  toggleSelectAll: () => void;
  bulkDeleteSelected: () => Promise<void>;
  clearSelection: () => void;
  reset: () => void;
}

const initialState: Omit<
  ItemsStore,
  | "setSearchInput"
  | "setEditingItem"
  | "fetchItems"
  | "persistItem"
  | "removeItem"
  | "toggleSelection"
  | "toggleSelectAll"
  | "bulkDeleteSelected"
  | "clearSelection"
  | "reset"
> = {
  items: [],
  pagination: null,
  currentPage: 1,
  searchInput: "",
  activeSearch: "",
  loadingItems: false,
  hasLoadedItems: false,
  editingItem: null,
  selectedIds: [],
  bulkDeleting: false,
};

export const useItemsStore = create<ItemsStore>((set, get) => ({
  ...initialState,

  setSearchInput: (value) => set({ searchInput: value }),

  setEditingItem: (item) => set({ editingItem: item }),

  async fetchItems(page = 1, rawSearch?: string) {
    const search = (rawSearch ?? get().activeSearch).trim();
    set({ loadingItems: true });
    try {
      const data = await itemsApi.list({
        page,
        search: search ? search : undefined,
      });

      set((state) => ({
        items: data.data,
        pagination: data.pagination,
        currentPage: data.pagination.page,
        activeSearch: search,
        loadingItems: false,
        hasLoadedItems: true,
        selectedIds: state.selectedIds.filter((id) =>
          data.data.some((item) => item.id === id),
        ),
      }));
    } catch (error) {
      set({ loadingItems: false, hasLoadedItems: true });
      const message =
        error instanceof Error ? error.message : "Unable to fetch items";
      toast.error(message);
      throw error;
    }
  },

  async persistItem(values) {
    const { editingItem, currentPage, activeSearch } = get();
    try {
      if (editingItem) {
        await itemsApi.update(editingItem.id, values);
        toast.success("Item updated");
      } else {
        await itemsApi.create(values);
        toast.success("Item created");
      }

      set({ editingItem: null });
      await get().fetchItems(currentPage, activeSearch);
      return editingItem ? "updated" : "created";
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : editingItem
            ? "Unable to update item"
            : "Unable to create item";
      toast.error(message);
      throw error;
    }
  },

  async removeItem(id) {
    const { items, pagination, currentPage, activeSearch, editingItem, selectedIds } =
      get();
    try {
      await itemsApi.remove(id);
      toast.success("Item deleted");

      const nextPage =
        items.length === 1 && (pagination?.page ?? 1) > 1
          ? Math.max(1, currentPage - 1)
          : currentPage;

      const filteredSelection = selectedIds.filter((selectedId) => selectedId !== id);

      set((state) => ({
        editingItem: editingItem?.id === id ? null : state.editingItem,
        selectedIds: filteredSelection,
      }));

      await get().fetchItems(nextPage, activeSearch);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to delete item";
      toast.error(message);
      throw error;
    }
  },

  toggleSelection: (id) =>
    set((state) => ({
      selectedIds: state.selectedIds.includes(id)
        ? state.selectedIds.filter((value) => value !== id)
        : [...state.selectedIds, id],
    })),

  toggleSelectAll: () =>
    set((state) => {
      const currentPageIds = state.items.map((item) => item.id);
      if (currentPageIds.length === 0) {
        return {};
      }

      const allSelected = currentPageIds.every((id) =>
        state.selectedIds.includes(id),
      );

      const selectedIds = allSelected
        ? state.selectedIds.filter((id) => !currentPageIds.includes(id))
        : Array.from(new Set([...state.selectedIds, ...currentPageIds]));

      return { selectedIds };
    }),

  async bulkDeleteSelected() {
    const { selectedIds, activeSearch, currentPage } = get();
    if (selectedIds.length === 0) {
      return;
    }

    set({ bulkDeleting: true });
    try {
      await itemsApi.bulkDelete(selectedIds);
      toast.success("Selected items deleted");
      set({ selectedIds: [] });
      await get().fetchItems(currentPage, activeSearch);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to delete selected items";
      toast.error(message);
      throw error;
    } finally {
      set({ bulkDeleting: false });
    }
  },

  clearSelection: () => set({ selectedIds: [] }),

  reset: () => set({ ...initialState }),
}));
