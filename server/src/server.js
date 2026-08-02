import app from "./app.js";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();