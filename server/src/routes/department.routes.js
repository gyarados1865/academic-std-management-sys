import express from "express";

import {
  createDepartment,
  deleteDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
} from "../controllers/department.controller.js";
import {
  authenticate,
  authorize,
} from "../middleware/auth.middleware.js";
import validate from "../validators/validation.middleware.js";
import { departmentSchema } from "../validators/department.validator.js";

const router = express.Router();

router.post("/", validate(departmentSchema), authenticate, authorize("ADMIN"), createDepartment);

router.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  updateDepartment
);

router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  deleteDepartment
);

router.get("/", authenticate, authorize("ADMIN", "TEACHER"), getAllDepartments);

router.get(
  "/:id",
  authenticate,
  authorize("ADMIN", "TEACHER"),
  getDepartmentById
);

export default router;
