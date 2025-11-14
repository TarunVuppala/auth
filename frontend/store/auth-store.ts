import { create } from "zustand";

import { authApi } from "@/lib/api";
import type { AuthState } from "@/lib/types";

const TOKEN_KEY = "auth_token";

const persistToken = (token: string | null) => {
  if (typeof window === "undefined") return;
  if (token) {
    window.localStorage.setItem(TOKEN_KEY, token);
  } else {
    window.localStorage.removeItem(TOKEN_KEY);
  }
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  initializing: true,
  authLoading: false,
  authError: null,

  hydrate: async () => {
    if (typeof window === "undefined") {
      set({ initializing: false });
      return;
    }

    const storedToken = window.localStorage.getItem(TOKEN_KEY);
    if (!storedToken) {
      set({ token: null, user: null, initializing: false });
      return;
    }

    set({ token: storedToken, initializing: true });
    try {
      const { user } = await authApi.me();
      set({ user, token: storedToken, initializing: false });
    } catch {
      persistToken(null);
      set({ user: null, token: null, initializing: false });
    }
  },

  login: async (payload) => {
    set({ authLoading: true, authError: null });
    try {
      const data = await authApi.login(payload);
      persistToken(data.token);
      set({ user: data.user, token: data.token, initializing: false });
      return data.user;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Authentication failed";
      set({ authError: message });
      throw error;
    } finally {
      set({ authLoading: false });
    }
  },

  signup: async (payload) => {
    set({ authLoading: true, authError: null });
    try {
      const data = await authApi.signup(payload);
      persistToken(data.token);
      set({ user: data.user, token: data.token, initializing: false });
      return data.user;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Authentication failed";
      set({ authError: message });
      throw error;
    } finally {
      set({ authLoading: false });
    }
  },

  logout: async () => {
    const token = get().token;
    try {
      if (token) {
        await authApi.logout();
      }
    } catch (error) {
      console.warn("Logout failed", error);
    } finally {
      persistToken(null);
      set({ user: null, token: null, authError: null, initializing: false });
    }
  },

  refreshUser: async () => {
    const token = get().token;
    if (!token) return;
    try {
      const { user } = await authApi.me();
      set({ user });
    } catch (error) {
      console.error("Unable to refresh user", error);
    }
  },

  clearError: () => set({ authError: null }),
}));
