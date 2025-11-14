import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";

import authRouter from "./routes/auth.js";
import itemsRouter from "./routes/items.js";
import adminRouter from "./routes/admin.js";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/error-handler.js";

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

app.use(
  cors({
    origin: env.CLIENT_ORIGIN ?? true,
    credentials: true,
  }),
);
app.use(limiter);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRouter);
app.use("/items", itemsRouter);
app.use("/admin", adminRouter);

app.use(errorHandler);

export default app;
