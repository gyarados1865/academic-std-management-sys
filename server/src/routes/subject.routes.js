import express from "express";

import {
  createSubject,
  deleteSubject,
  getAllSubjects,
  getSubjectById,
  updateSubject,
} from "../controllers/subject.controller.js";
import {
  authenticate,
  authorize,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authenticate, authorize("ADMIN"), createSubject);

router.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  updateSubject
);

router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  deleteSubject
);

router.get("/", authenticate, authorize("ADMIN", "TEACHER"), getAllSubjects);

router.get(
  "/:id",
  authenticate,
  authorize("ADMIN", "TEACHER"),
  getSubjectById
);

export default router;
