import { config } from "dotenv";
import { z } from "zod";

config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().default(8000),
  MONGODB_URI: z.string().url("MONGODB_URI must be a valid Mongo connection URL"),
  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET should be at least 32 characters for security"),
  CLIENT_ORIGIN: z
    .string()
    .url("CLIENT_ORIGIN must be a valid URL")
    .optional(),
});

export const env = envSchema.parse(process.env);
