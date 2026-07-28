import express from "express";

import {
  createResult,
  deleteResult,
  getAllResults,
  getResultById,
  updateResult,
} from "../controllers/result.controller.js";
import {
  authenticate,
  authorize,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authenticate, authorize("ADMIN"), createResult);

router.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  updateResult
);

router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  deleteResult
);

router.get("/", authenticate, authorize("ADMIN", "TEACHER"), getAllResults);

router.get(
  "/:id",
  authenticate,
  authorize("ADMIN", "TEACHER"),
  getResultById
);

export default router;
