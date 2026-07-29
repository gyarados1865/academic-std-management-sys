import express from "express";

import {
  createAttendance,
  deleteAttendance,
  getAllAttendances,
  getAttendanceById,
  updateAttendance,
} from "../controllers/attendance.controller.js";
import {
  authenticate,
  authorize,
} from "../middleware/auth.middleware.js";
import validate from "../validators/validation.middleware.js";
import { attendanceSchema } from "../validators/attendance.validator.js";

const router = express.Router();

router.post("/", validate(attendanceSchema), authenticate, authorize("ADMIN"), createAttendance);

router.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  updateAttendance
);

router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  deleteAttendance
);

router.get("/", authenticate, authorize("ADMIN", "TEACHER"), getAllAttendances);

router.get(
  "/:id",
  authenticate,
  authorize("ADMIN", "TEACHER"),
  getAttendanceById
);

export default router;
