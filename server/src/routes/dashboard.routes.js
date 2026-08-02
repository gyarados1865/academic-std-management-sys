import express from "express";

import { getDashboardStats } from "../controllers/dashboard.controller.js";
import {
  authenticate,
  authorize,
} from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     description: >
 *       Retrieves aggregate summary statistics for the admin dashboard
 *       (e.g. total counts of students, teachers, departments, and courses).
 *       Requires the **ADMIN** role.
 *
 *       **Note:** the exact shape of `data` below is a placeholder pending
 *       review of `dashboard.controller.js` — update once the real
 *       aggregation fields are confirmed.
 *     tags:
 *       - Dashboard
 *     operationId: getDashboardStats
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               message: "Dashboard statistics retrieved successfully."
 *               data:
 *                 totalStudents: 1240
 *                 totalTeachers: 86
 *                 totalDepartments: 6
 *                 totalCourses: 14
 *       401:
 *         description: Missing or invalid JWT access token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedResponse'
 *       403:
 *         description: Authenticated user does not have the ADMIN role.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ForbiddenResponse'
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerErrorResponse'
 */
router.get("/stats", authenticate, authorize("ADMIN"), getDashboardStats);

export default router;