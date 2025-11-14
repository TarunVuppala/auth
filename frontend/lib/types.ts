export type UserRole = "user" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ItemOwnerDetails {
  id: string;
  name: string;
  email: string;
  role: UserRole | string;
}

export interface Item {
  id: string;
  owner: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  ownerDetails?: ItemOwnerDetails;
}

export interface ItemFormValues {
  title: string;
  description?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface ItemsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface ItemListResponse {
  data: Item[];
  pagination: Pagination;
}

export interface AdminMetrics {
  totalUsers: number;
  totalItems: number;
  adminCount: number;
  userCount: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  initializing: boolean;
  authLoading: boolean;
  authError: string | null;
  hydrate: () => Promise<void>;
  login: (payload: LoginPayload) => Promise<User>;
  signup: (payload: SignupPayload) => Promise<User>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}
