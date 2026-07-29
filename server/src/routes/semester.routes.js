import express from "express";

import {
  createSemester,
  deleteSemester,
  getAllSemesters,
  getSemesterById,
  updateSemester,
} from "../controllers/semester.controller.js";
import {
  authenticate,
  authorize,
} from "../middleware/auth.middleware.js";
import validate from "../validators/validation.middleware.js";
import { semesterSchema } from "../validators/semester.validator.js";

const router = express.Router();

router.post("/", validate(semesterSchema), authenticate, authorize("ADMIN"), createSemester);

router.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  updateSemester
);

router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  deleteSemester
);

router.get("/", authenticate, authorize("ADMIN", "TEACHER"), getAllSemesters);

router.get(
  "/:id",
  authenticate,
  authorize("ADMIN", "TEACHER"),
  getSemesterById
);

export default router;
