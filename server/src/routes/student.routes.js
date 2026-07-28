import express from "express";

import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../controllers/student.controller.js";
import {
  authenticate,
  authorize,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authenticate, authorize("ADMIN"), createStudent);

router.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  updateStudent
);

router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  deleteStudent
);

router.get("/", authenticate, authorize("ADMIN", "TEACHER"), getAllStudents);

router.get(
  "/:id",
  authenticate,
  authorize("ADMIN", "TEACHER"),
  getStudentById
);

export default router;