import express from "express";

import {
  createEnrollment,
  deleteEnrollment,
  getAllEnrollments,
  getEnrollmentById,
  updateEnrollment,
} from "../controllers/enrollment.controller.js";
import {
  authenticate,
  authorize,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authenticate, authorize("ADMIN"), createEnrollment);

router.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  updateEnrollment
);

router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  deleteEnrollment
);

router.get("/", authenticate, authorize("ADMIN", "TEACHER"), getAllEnrollments);

router.get(
  "/:id",
  authenticate,
  authorize("ADMIN", "TEACHER"),
  getEnrollmentById
);

export default router;
