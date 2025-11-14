import app from "./app.js";
import { env } from "./config/env.js";
import { connectToDatabase } from "./db/connection.js";

const start = async () => {
  try {
    await connectToDatabase();
    app.listen(env.PORT, () => {
      console.log(`Server is running on port ${env.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start the server", error);
    process.exit(1);
  }
};

void start();
