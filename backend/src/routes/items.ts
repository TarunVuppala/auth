import express from "express";
import { Types } from "mongoose";
import { z } from "zod";

import { authenticate } from "../middleware/auth";
import { Item, type ItemDocument } from "../models/Item";

const router = express.Router();

const itemSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().max(500).optional(),
});

router.use(authenticate);

const escapeRegex = (input: string) => input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

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

const bulkDeleteSchema = z.object({
  ids: z.array(z.string()).min(1),
});

router.get("/", async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
    const search =
      typeof req.query.search === "string" ? req.query.search.trim() : "";

    const query: Record<string, unknown> = {};

    if (req.user?.role !== "admin") {
      query.owner = req.user?.id;
    }

    if (search) {
      const escaped = escapeRegex(search);
      const regex = new RegExp(escaped, "i");
      query.$or = [{ title: regex }, { description: regex }];
    }

    const totalItems = await Item.countDocuments(query);
    const totalPages = Math.max(1, Math.ceil(totalItems / limit) || 1);
    const safePage = Math.min(page, totalPages);

    const queryBuilder = Item.find(query)
      .sort({ createdAt: -1 })
      .skip((safePage - 1) * limit)
      .limit(limit);

    if (req.user?.role === "admin") {
      queryBuilder.populate("owner", "name email role");
    }

    const items = await queryBuilder;

    res.json({
      data: items.map((item) => toItemResponse(item)),
      pagination: {
        page: safePage,
        limit,
        totalItems,
        totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const payload = itemSchema.parse(req.body);
    const item = await Item.create({
      ...payload,
      owner: req.user!.id,
    });

    res.status(201).json({ item: toItemResponse(item) });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id || !Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid item id" });
      return;
    }

    const payload = itemSchema.partial().parse(req.body);
    const item = await Item.findById(id);

    if (!item) {
      res.status(404).json({ message: "Item not found" });
      return;
    }

    if (item.owner.toString() !== req.user!.id && req.user?.role !== "admin") {
      res.status(403).json({ message: "Insufficient permissions" });
      return;
    }

    Object.assign(item, payload);
    await item.save();

    res.json({ item: toItemResponse(item) });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id || !Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid item id" });
      return;
    }

    const item = await Item.findById(id);

    if (!item) {
      res.status(404).json({ message: "Item not found" });
      return;
    }

    if (item.owner.toString() !== req.user!.id && req.user?.role !== "admin") {
      res.status(403).json({ message: "Insufficient permissions" });
      return;
    }

    await item.deleteOne();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

router.post("/bulk-delete", async (req, res, next) => {
  try {
    const payload = bulkDeleteSchema.parse(req.body);
    const validIds = payload.ids.filter((id) => Types.ObjectId.isValid(id));

    if (validIds.length === 0) {
      res.status(400).json({ message: "Provide at least one valid item id" });
      return;
    }

    const filter: Record<string, unknown> = { _id: { $in: validIds } };
    if (req.user?.role !== "admin") {
      filter.owner = req.user!.id;
    }

    const result = await Item.deleteMany(filter);
    res.json({ deletedCount: result.deletedCount ?? 0 });
  } catch (error) {
    next(error);
  }
});

export default router;
