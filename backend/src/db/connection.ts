import mongoose, { type ConnectOptions } from "mongoose";

import { env } from "../config/env.js";

export const connectToDatabase = async (
  uri?: string,
  overrideOptions: ConnectOptions = {},
): Promise<typeof mongoose> => {
  mongoose.set("strictQuery", true);
  const options: ConnectOptions = { ...overrideOptions };

  if (!uri && env.NODE_ENV === "test" && !options.dbName) {
    options.dbName = "auth_app_test";
  }

  return mongoose.connect(uri ?? env.MONGODB_URI, options);
};

export const disconnectFromDatabase = async (): Promise<void> => {
  await mongoose.disconnect();
};
