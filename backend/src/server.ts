import app from "./app";
import { env } from "./config/env";
import { connectToDatabase } from "./db/connection";

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
