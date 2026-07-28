import express from "express";

import { getDashboardStats } from "../controllers/dashboard.controller.js";
import {
  authenticate,
  authorize,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/stats", authenticate, authorize("ADMIN"), getDashboardStats);

export default router;
