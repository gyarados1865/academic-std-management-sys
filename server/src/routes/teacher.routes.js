import express from "express";

import {
  createTeacher,
  deleteTeacher,
  getAllTeachers,
  getTeacherById,
  updateTeacher,
} from "../controllers/teacher.controller.js";
import {
  authenticate,
  authorize,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authenticate, authorize("ADMIN"), createTeacher);

router.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  updateTeacher
);

router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  deleteTeacher
);

router.get("/", authenticate, authorize("ADMIN", "TEACHER"), getAllTeachers);

router.get(
  "/:id",
  authenticate,
  authorize("ADMIN", "TEACHER"),
  getTeacherById
);

export default router;
