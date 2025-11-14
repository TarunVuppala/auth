import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

interface AppError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof ZodError) {
    res.status(400).json({
      message: "Validation failed",
      issues: err.flatten(),
    });
    return;
  }

  const status = err.statusCode ?? 500;
  const message =
    status >= 500 ? "Something went wrong. Please try again later." : err.message;

  if (status >= 500) {
    console.error(err);
  }

  res.status(status).json({ message });
};
