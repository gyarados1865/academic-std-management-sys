import { Router } from "express";
import authRoutes from "./auth.routes.js";

const router = Router();

// Health Check
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Academic Student Management System API is running",
  });
});

// Feature Routes
router.use("/auth", authRoutes);

export default router;