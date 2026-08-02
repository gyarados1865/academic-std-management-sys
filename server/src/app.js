import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";

import routes from "./routes/index.js";

const app = express();

// =========================
// Global Middleware
// =========================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// =========================
// Swagger Documentation
// =========================

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// =========================
// Root Route
// =========================

app.get("/", (req, res) => {
  res.redirect("/api-docs");
});

// =========================
// API Routes
// =========================

app.use("/api", routes);

// =========================
// 404 Handler
// =========================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found.",
  });
});

export default app;