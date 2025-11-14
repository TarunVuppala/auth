"use client";

import { create } from "zustand";
import { toast } from "sonner";

import { adminApi } from "@/lib/api";
import type { AdminMetrics, User, UserRole } from "@/lib/types";

interface AdminStore {
  metrics: AdminMetrics | null;
  users: User[];
  loading: boolean;
  busyUserId: string | null;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  fetchAdminData: (searchTerm?: string) => Promise<void>;
  updateUserRole: (userId: string, role: UserRole) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  reset: () => void;
}

const initialState: Omit<
  AdminStore,
  "setSearchTerm" | "fetchAdminData" | "updateUserRole" | "deleteUser" | "reset"
> = {
  metrics: null,
  users: [],
  loading: false,
  busyUserId: null,
  searchTerm: "",
};

export const useAdminStore = create<AdminStore>((set, get) => ({
  ...initialState,

  setSearchTerm: (value) => set({ searchTerm: value }),

  async fetchAdminData(rawSearch?: string) {
    const searchTerm = (rawSearch ?? get().searchTerm).trim();
    set({ loading: true });
    try {
      const [metricsRes, usersRes] = await Promise.all([
        adminApi.metrics(),
        adminApi.users(searchTerm),
      ]);
      set({
        metrics: metricsRes.metrics,
        users: usersRes.users,
        loading: false,
        searchTerm,
      });
    } catch (error) {
      set({ loading: false });
      const message =
        error instanceof Error ? error.message : "Unable to fetch admin data";
      toast.error(message);
      throw error;
    }
  },

  async updateUserRole(userId, role) {
    set({ busyUserId: userId });
    try {
      await adminApi.updateUserRole(userId, role);
      toast.success(role === "admin" ? "User promoted" : "User updated");
      await get().fetchAdminData(get().searchTerm);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to update user";
      toast.error(message);
      throw error;
    } finally {
      set({ busyUserId: null });
    }
  },

  async deleteUser(userId) {
    set({ busyUserId: userId });
    try {
      await adminApi.deleteUser(userId);
      toast.success("User removed");
      await get().fetchAdminData(get().searchTerm);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to delete user";
      toast.error(message);
      throw error;
    } finally {
      set({ busyUserId: null });
    }
  },

  reset: () => set({ ...initialState }),
}));
