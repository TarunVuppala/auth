import express from "express";
import { z } from "zod";

import { User, type UserDocument } from "../models/User.js";
import { signToken } from "../utils/jwt.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

const roleEnum = z.enum(["user", "admin"]);

const signupSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8),
  role: roleEnum,
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const toUserResponse = (user: UserDocument) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

router.post("/signup", async (req, res, next) => {
  try {
    const payload = signupSchema.parse(req.body);
    const { email } = payload;

    const existing = await User.findOne({ email: email.toLowerCase() });

    if (existing) {
      res.status(409).json({ message: "Email already in use" });
      return;
    }

    const user = await User.create({
      ...payload,
      email: email.toLowerCase(),
    });

    const token = signToken({ userId: user.id, role: user.role });

    res.status(201).json({
      token,
      user: toUserResponse(user),
    });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const payload = loginSchema.parse(req.body);
    const user = await User.findOne({ email: payload.email.toLowerCase() });

    if (!user || !(await user.comparePassword(payload.password))) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = signToken({ userId: user.id, role: user.role });

    res.json({
      token,
      user: toUserResponse(user),
    });
  } catch (error) {
    next(error);
  }
});

router.get("/me", authenticate, async (req, res) => {
  res.json({ user: req.user });
});

router.post("/logout", authenticate, async (_req, res) => {
  res.json({ message: "Logged out" });
});

export default router;
