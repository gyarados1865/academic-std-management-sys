import app from "./app.js";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";

const PORT = env.PORT;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(
      `🚀 Server running on http://localhost:${PORT}`
    );
  });
};

startServer();