"use client";

import { apiClient } from "./http";
import type {
  AdminMetrics,
  AuthResponse,
  Item,
  ItemFormValues,
  ItemListResponse,
  ItemsQueryParams,
  LoginPayload,
  SignupPayload,
  User,
} from "./types";

export const authApi = {
  signup: (payload: SignupPayload) =>
    apiClient.post<AuthResponse>("/auth/signup", payload).then((res) => res.data),
  login: (payload: LoginPayload) =>
    apiClient.post<AuthResponse>("/auth/login", payload).then((res) => res.data),
  me: () => apiClient.get<{ user: User }>("/auth/me").then((res) => res.data),
  logout: () => apiClient.post("/auth/logout"),
};

export const itemsApi = {
  list: (params: ItemsQueryParams) =>
    apiClient
      .get<ItemListResponse>("/items", { params })
      .then((res) => res.data),
  create: (payload: ItemFormValues) =>
    apiClient.post<{ item: Item }>("/items", payload).then((res) => res.data),
  update: (id: string, payload: Partial<Item>) =>
    apiClient
      .patch<{ item: Item }>(`/items/${id}`, payload)
      .then((res) => res.data),
  remove: (id: string) => apiClient.delete(`/items/${id}`),
  bulkDelete: (ids: string[]) =>
    apiClient
      .post<{ deletedCount: number }>("/items/bulk-delete", { ids })
      .then((res) => res.data),
};

export const adminApi = {
  metrics: () =>
    apiClient.get("/admin/metrics").then((res) => res.data as {
      metrics: AdminMetrics;
      recentItems: Item[];
    }),
  users: (search?: string) =>
    apiClient
      .get<{ users: User[] }>("/admin/users", {
        params: search ? { search } : undefined,
      })
      .then((res) => res.data),
  updateUserRole: (id: string, role: "user" | "admin") =>
    apiClient
      .patch<{ user: User }>(`/admin/users/${id}/role`, { role })
      .then((res) => res.data),
  deleteUser: (id: string) => apiClient.delete(`/admin/users/${id}`),
};
