"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuthStore } from "@/store/auth-store";
import { useItemsStore } from "@/store/items-store";
import { useAdminStore } from "@/store/admin-store";
import type { ItemFormValues } from "@/lib/types";
import { AdminPanel } from "@/components/dashboard/admin-panel";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { ItemFormCard } from "@/components/dashboard/item-form-card";
import { ItemsPanel } from "@/components/dashboard/items-panel";
import { Loader } from "@/components/ui/loader";

const itemSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().max(500, "Description can be up to 500 characters").optional(),
});

export default function DashboardPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const initializing = useAuthStore((state) => state.initializing);
  const logout = useAuthStore((state) => state.logout);
  const {
    items,
    pagination,
    currentPage,
    searchInput,
    activeSearch,
    loadingItems,
    hasLoadedItems,
    editingItem,
    selectedIds,
    bulkDeleting,
    setSearchInput,
    setEditingItem,
    fetchItems,
    persistItem,
    removeItem,
    toggleSelection,
    toggleSelectAll,
    bulkDeleteSelected,
    reset: resetItemsStore,
  } = useItemsStore();

  const {
    metrics: adminMetrics,
    users: adminUsers,
    loading: adminLoading,
    busyUserId: adminBusyUserId,
    searchTerm: adminSearchTerm,
    setSearchTerm: setAdminSearchTerm,
    fetchAdminData,
    updateUserRole,
    deleteUser,
    reset: resetAdminStore,
  } = useAdminStore();

  const itemForm = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  useEffect(() => {
    if (editingItem) {
      itemForm.reset({
        title: editingItem.title,
        description: editingItem.description ?? "",
      });
    } else {
      itemForm.reset({
        title: "",
        description: "",
      });
    }
  }, [editingItem, itemForm]);

  useEffect(() => {
    if (!user) {
      resetItemsStore();
      resetAdminStore();
    }
  }, [user, resetItemsStore, resetAdminStore]);

  useEffect(() => {
    if (!user) return;
    void fetchItems(1, "");
    if (user.role === "admin") {
      void fetchAdminData("");
    }
  }, [user, fetchItems, fetchAdminData]);

  useEffect(() => {
    if (!user) return;
    const handler = setTimeout(() => {
      const trimmed = searchInput.trim();
      if (trimmed !== activeSearch) {
        void fetchItems(1, trimmed);
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [user, searchInput, activeSearch, fetchItems]);

  const welcomeMessage = useMemo(() => {
    if (!user) return "Loading...";
    const roleLabel = user.role === "admin" ? "Admin" : "Member";
    return `${user.name} (${roleLabel})`;
  }, [user]);

  const isEditing = Boolean(editingItem);
  const currentPageIds = useMemo(() => items.map((item) => item.id), [items]);
  const allSelected =
    currentPageIds.length > 0 && currentPageIds.every((id) => selectedIds.includes(id));
  const someSelected = currentPageIds.some((id) => selectedIds.includes(id));
  const hasSelection = selectedIds.length > 0;

  const submitItem = async (values: ItemFormValues) => {
    try {
      await persistItem(values);
      itemForm.reset({ title: "", description: "" });
    } catch {
      // errors are surfaced via the store
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await removeItem(itemId);
    } catch {
      // store already surfaces the toast
    }
  };

  const handlePageChange = (direction: "prev" | "next") => {
    if (!pagination) return;
    const totalPages = pagination.totalPages;
    const nextPage =
      direction === "prev"
        ? Math.max(1, currentPage - 1)
        : Math.min(totalPages, currentPage + 1);
    if (nextPage === currentPage) return;
    void fetchItems(nextPage, activeSearch);
  };

  const handleAdminRoleChange = async (userId: string, role: "user" | "admin") => {
    try {
      await updateUserRole(userId, role);
      await fetchItems(currentPage, activeSearch);
    } catch {
      // store already surfaced the error
    }
  };

  const handleAdminDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId);
      await fetchItems(1, activeSearch);
    } catch {
      // store already surfaced the error
    }
  };

  const handleRefresh = () => {
    void fetchItems(currentPage, activeSearch);
  };

  const handleCancelEditing = () => {
    setEditingItem(null);
  };

  const handleBulkDelete = async () => {
    if (!hasSelection) return;
    const confirmed = window.confirm(
      `Delete ${selectedIds.length} selected item${selectedIds.length > 1 ? "s" : ""}?`,
    );
    if (!confirmed) return;

    try {
      await bulkDeleteSelected();
    } catch {
      // toast already shown inside the store
    }
  };

  const handleLogout = async () => {
    await logout();
    resetItemsStore();
    resetAdminStore();
    router.replace("/login");
  };

  useEffect(() => {
    if (!initializing && !user) {
      router.replace("/login");
    }
  }, [initializing, user, router]);

  useEffect(() => {
    if (!user || user.role !== "admin") return;
    const handler = setTimeout(() => {
      void fetchAdminData(adminSearchTerm);
    }, 400);
    return () => clearTimeout(handler);
  }, [user, adminSearchTerm, fetchAdminData]);

  if (initializing) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <Loader label="Preparing dashboard..." />
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10">
      <DashboardHeader welcomeMessage={welcomeMessage} user={user} onLogout={handleLogout} />

      <section className="mt-8 grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <ItemFormCard
            form={itemForm}
            isEditing={isEditing}
            editingItem={editingItem}
            onCancel={handleCancelEditing}
            onSubmit={submitItem}
          />
        </div>
        <ItemsPanel
          userRole={user.role}
          items={items}
          loadingState={{ loading: loadingItems, hasLoaded: hasLoadedItems }}
          search={{ value: searchInput, onChange: setSearchInput, onRefresh: handleRefresh }}
          selection={{
            hasSelection,
            bulkDeleting,
            selectedCount: selectedIds.length,
            onBulkDelete: handleBulkDelete,
            selectedIds,
            onToggleSelect: toggleSelection,
            onToggleSelectAll: toggleSelectAll,
            allSelected,
            someSelected,
            currentPageIds,
          }}
          paginationState={{
            pagination,
            currentPage,
            onPrevious: () => handlePageChange("prev"),
            onNext: () => handlePageChange("next"),
          }}
          onEdit={(item) => setEditingItem(item)}
          onDelete={handleDeleteItem}
          editingItemId={editingItem?.id ?? null}
        />
      </section>

      {user.role === "admin" && (
        <AdminPanel
          metrics={adminMetrics}
          users={adminUsers}
          onPromote={handleAdminRoleChange}
          onDelete={handleAdminDeleteUser}
          searchTerm={adminSearchTerm}
          onSearchTermChange={setAdminSearchTerm}
          busyUserId={adminBusyUserId}
          loading={adminLoading}
        />
      )}
    </main>
  );
}
