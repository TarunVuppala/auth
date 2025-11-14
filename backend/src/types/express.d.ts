import type { UserRole } from "../models/User.js";

declare global {
  namespace Express {
    interface AuthenticatedUser {
      id: string;
      name: string;
      email: string;
      role: UserRole;
    }

    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export {};
