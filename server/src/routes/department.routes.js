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

const router = express.Router();

router.post("/", authenticate, authorize("ADMIN"), createDepartment);

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
