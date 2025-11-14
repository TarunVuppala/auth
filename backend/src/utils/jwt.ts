import jwt from "jsonwebtoken";

import { env } from "../config/env";
import type { UserRole } from "../models/User";

interface TokenPayload {
  userId: string;
  role: UserRole;
}

export const signToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "2h" });
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
};
