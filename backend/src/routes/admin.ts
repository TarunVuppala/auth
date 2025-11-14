import express from "express";
import { Types } from "mongoose";
import { z } from "zod";

import { authenticate, requireRole } from "../middleware/auth";
import { User, type UserDocument } from "../models/User";
import { Item, type ItemDocument } from "../models/Item";

const router = express.Router();

router.use(authenticate, requireRole(["admin"]));

const toUserResponse = (user: UserDocument) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const toItemResponse = (item: ItemDocument) => {
  const ownerValue =
    typeof item.owner === "string"
      ? item.owner
      : item.owner && "toString" in item.owner
        ? (item.owner as { toString: () => string }).toString()
        : "";

  const response = {
    id: item.id,
    owner: ownerValue,
    title: item.title,
    description: item.description,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  } as {
    id: string;
    owner: string;
    title: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
    ownerDetails?: {
      id: string;
      name?: string;
      email?: string;
      role?: string;
    };
  };

  if (typeof item.owner === "object" && item.owner !== null && "_id" in item.owner) {
    const ownerDoc = item.owner as {
      _id: { toString: () => string };
      name?: string;
      email?: string;
      role?: string;
    };

    response.ownerDetails = {
      id: ownerDoc._id.toString(),
      ...(ownerDoc.name ? { name: ownerDoc.name } : {}),
      ...(ownerDoc.email ? { email: ownerDoc.email } : {}),
      ...(ownerDoc.role ? { role: ownerDoc.role } : {}),
    };
  }

  return response;
};

const escapeRegex = (input: string) => input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

router.get("/metrics", async (_req, res, next) => {
  try {
    const [totalUsers, totalItems, adminCount, userCount, recentItems] = await Promise.all([
      User.countDocuments(),
      Item.countDocuments(),
      User.countDocuments({ role: "admin" }),
      User.countDocuments({ role: "user" }),
      Item.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("owner", "name email role"),
    ]);

    res.json({
      metrics: {
        totalUsers,
        totalItems,
        adminCount,
        userCount,
      },
      recentItems: recentItems.map((item) => toItemResponse(item)),
    });
  } catch (error) {
    next(error);
  }
});

router.get("/users", async (req, res, next) => {
  try {
    const search =
      typeof req.query.search === "string" ? req.query.search.trim() : "";

    const query: Record<string, unknown> = {};

    if (search) {
      const escaped = escapeRegex(search);
      const regex = new RegExp(escaped, "i");
      query.$or = [{ name: regex }, { email: regex }];
    }

    const users = await User.find(query).sort({ createdAt: -1 }).limit(50);

    res.json({
      users: users.map(toUserResponse),
    });
  } catch (error) {
    next(error);
  }
});

const updateRoleSchema = z.object({
  role: z.enum(["user", "admin"]),
});

router.patch("/users/:id/role", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id || !Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid user id" });
      return;
    }

    const payload = updateRoleSchema.parse(req.body);
    const user = await User.findById(id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    user.role = payload.role;
    await user.save();

    res.json({ user: toUserResponse(user) });
  } catch (error) {
    next(error);
  }
});

router.delete("/users/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id || !Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid user id" });
      return;
    }

    if (req.user?.id === id) {
      res.status(400).json({ message: "You cannot delete your own account" });
      return;
    }

    const user = await User.findById(id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    await Item.deleteMany({ owner: id });
  	await user.deleteOne();

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
