import express from "express";

import {
  createCourse,
  deleteCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
} from "../controllers/course.controller.js";
import {
  authenticate,
  authorize,
} from "../middleware/auth.middleware.js";
import validate from "../validators/validation.middleware.js";
import { courseSchema } from "../validators/course.validator.js";

const router = express.Router();

router.post("/", validate(courseSchema), authenticate, authorize("ADMIN"), createCourse);

router.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  updateCourse
);

router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  deleteCourse
);

router.get("/", authenticate, authorize("ADMIN", "TEACHER"), getAllCourses);

router.get(
  "/:id",
  authenticate,
  authorize("ADMIN", "TEACHER"),
  getCourseById
);

export default router;
