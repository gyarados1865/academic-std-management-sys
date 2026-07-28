import express from "express";

import authRoutes from "./auth.routes.js";
import courseRoutes from "./course.routes.js";
import departmentRoutes from "./department.routes.js";
import studentRoutes from "./student.routes.js";
import teacherRoutes from "./teacher.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/students", studentRoutes);
router.use("/teachers", teacherRoutes);
router.use("/departments", departmentRoutes);
router.use("/courses", courseRoutes);

export default router;