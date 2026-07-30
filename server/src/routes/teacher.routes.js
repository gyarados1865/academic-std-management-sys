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
import validate from "../validators/validation.middleware.js";
import { teacherSchema } from "../validators/teacher.validator.js";

const router = express.Router();

/**
 * @swagger
 * /api/teachers:
 *   post:
 *     summary: Create a teacher
 *     description: >
 *       Creates a new teacher record in the system. Requires the **ADMIN** role.
 *       The payload creates both a User account and the teacher employment profile.
 *     tags:
 *       - Teachers
 *     operationId: createTeacher
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTeacherRequest'
 *     responses:
 *       201:
 *         description: Teacher created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               message: "Teacher created successfully."
 *               data:
 *                 id: "cljk0a1c20002qzrm6j0k3l4m"
 *                 employeeId: "EMP-2024-001"
 *                 phone: "+923001234567"
 *                 address: "House 12, Street 4, F-10, Islamabad"
 *                 departmentId: "cljk0g7h80003qzrmbl3m8n9o"
 *                 userId: "cljk0a1b20000qzrm5f8g2h3i"
 *                 isActive: true
 *                 createdAt: "2026-01-15T09:30:00.000Z"
 *                 updatedAt: "2026-01-15T09:30:00.000Z"
 *       400:
 *         description: Validation error — one or more fields failed validation.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *             example:
 *               success: false
 *               message: "\"employeeId\" is required."
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
 *       409:
 *         description: Teacher already exists.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConflictResponse'
 *             example:
 *               success: false
 *               message: "Teacher already exists."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerErrorResponse'
 */
router.post("/", validate(teacherSchema), authenticate, authorize("ADMIN"), createTeacher);

/**
 * @swagger
 * /api/teachers/{id}:
 *   put:
 *     summary: Update a teacher
 *     description: >
 *       Updates an existing teacher by ID. Requires the **ADMIN** role.
 *       The update endpoint does not run request schema validation middleware on all fields.
 *     tags:
 *       - Teachers
 *     operationId: updateTeacher
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "cljk0a1c20002qzrm6j0k3l4m"
 *         description: Unique teacher identifier.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTeacherRequest'
 *     responses:
 *       200:
 *         description: Teacher updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               message: "Teacher updated successfully."
 *               data:
 *                 id: "cljk0a1c20002qzrm6j0k3l4m"
 *                 employeeId: "EMP-2024-001"
 *                 phone: "+923001234567"
 *                 address: "House 12, Street 4, F-10, Islamabad"
 *                 departmentId: "cljk0g7h80003qzrmbl3m8n9o"
 *                 userId: "cljk0a1b20000qzrm5f8g2h3i"
 *                 isActive: true
 *                 createdAt: "2026-01-15T09:30:00.000Z"
 *                 updatedAt: "2026-02-10T10:15:00.000Z"
 *       400:
 *         description: Validation error — one or more fields failed validation.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
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
 *       404:
 *         description: Teacher not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundResponse'
 *             example:
 *               success: false
 *               message: "Teacher not found."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerErrorResponse'
 */
router.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  updateTeacher
);

/**
 * @swagger
 * /api/teachers/{id}:
 *   delete:
 *     summary: Delete a teacher
 *     description: Deletes an existing teacher by ID. Requires the **ADMIN** role.
 *     tags:
 *       - Teachers
 *     operationId: deleteTeacher
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "cljk0a1c20002qzrm6j0k3l4m"
 *         description: Unique teacher identifier.
 *     responses:
 *       200:
 *         description: Teacher deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               message: "Teacher deleted successfully."
 *               data:
 *                 id: "cljk0a1c20002qzrm6j0k3l4m"
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
 *       404:
 *         description: Teacher not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundResponse'
 *             example:
 *               success: false
 *               message: "Teacher not found."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerErrorResponse'
 */
router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  deleteTeacher
);

/**
 * @swagger
 * /api/teachers:
 *   get:
 *     summary: Get all teachers
 *     description: Retrieves a paginated list of teachers with optional search and sorting.
 *     tags:
 *       - Teachers
 *     operationId: getAllTeachers
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: Teachers retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *             example:
 *               success: true
 *               pagination:
 *                 page: 1
 *                 limit: 10
 *                 total: 1
 *                 totalPages: 1
 *               data:
 *                 - id: "cljk0a1c20002qzrm6j0k3l4m"
 *                   employeeId: "EMP-2024-001"
 *                   phone: "+923001234567"
 *                   address: "House 12, Street 4, F-10, Islamabad"
 *                   departmentId: "cljk0g7h80003qzrmbl3m8n9o"
 *                   userId: "cljk0a1b20000qzrm5f8g2h3i"
 *                   isActive: true
 *                   createdAt: "2026-01-15T09:30:00.000Z"
 *                   updatedAt: "2026-01-15T09:30:00.000Z"
 *       401:
 *         description: Missing or invalid JWT access token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedResponse'
 *       403:
 *         description: Authenticated user does not have permission to view teachers.
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
router.get("/", authenticate, authorize("ADMIN", "TEACHER"), getAllTeachers);

/**
 * @swagger
 * /api/teachers/{id}:
 *   get:
 *     summary: Get teacher by ID
 *     description: Retrieves a single teacher by their unique identifier.
 *     tags:
 *       - Teachers
 *     operationId: getTeacherById
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "cljk0a1c20002qzrm6j0k3l4m"
 *         description: Unique teacher identifier.
 *     responses:
 *       200:
 *         description: Teacher retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               message: "Teacher retrieved successfully."
 *               data:
 *                 id: "cljk0a1c20002qzrm6j0k3l4m"
 *                 employeeId: "EMP-2024-001"
 *                 phone: "+923001234567"
 *                 address: "House 12, Street 4, F-10, Islamabad"
 *                 departmentId: "cljk0g7h80003qzrmbl3m8n9o"
 *                 userId: "cljk0a1b20000qzrm5f8g2h3i"
 *                 isActive: true
 *                 createdAt: "2026-01-15T09:30:00.000Z"
 *                 updatedAt: "2026-01-15T09:30:00.000Z"
 *       401:
 *         description: Missing or invalid JWT access token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedResponse'
 *       403:
 *         description: Authenticated user does not have permission to view this teacher.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ForbiddenResponse'
 *       404:
 *         description: Teacher not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundResponse'
 *             example:
 *               success: false
 *               message: "Teacher not found."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerErrorResponse'
 */
router.get(
  "/:id",
  authenticate,
  authorize("ADMIN", "TEACHER"),
  getTeacherById
);

export default router;
