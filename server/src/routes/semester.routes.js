import express from "express";

import {
  createSemester,
  deleteSemester,
  getAllSemesters,
  getSemesterById,
  updateSemester,
} from "../controllers/semester.controller.js";
import {
  authenticate,
  authorize,
} from "../middleware/auth.middleware.js";
import validate from "../validators/validation.middleware.js";
import { semesterSchema } from "../validators/semester.validator.js";

const router = express.Router();

/**
 * @swagger
 * /api/semesters:
 *   post:
 *     summary: Create a semester
 *     description: >
 *       Creates a new semester record in the system. Requires the **ADMIN** role.
 *       Semester names must be unique within the academic catalog.
 *     tags:
 *       - Semesters
 *     operationId: createSemester
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSemesterRequest'
 *     responses:
 *       201:
 *         description: Semester created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               message: "Semester created successfully."
 *               data:
 *                 id: "cljk0x8s90009qzrmsy4a6b7c"
 *                 name: "First Semester"
 *                 code: "SEM-1"
 *                 startDate: "2026-08-01T00:00:00.000Z"
 *                 endDate: "2026-12-15T00:00:00.000Z"
 *                 status: "UPCOMING"
 *                 createdAt: "2026-07-01T08:00:00.000Z"
 *                 updatedAt: "2026-07-01T08:00:00.000Z"
 *       400:
 *         description: Validation error — one or more fields failed validation.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *             example:
 *               success: false
 *               message: "\"name\" is required."
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
 *         description: Semester already exists.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConflictResponse'
 *             example:
 *               success: false
 *               message: "Semester already exists."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerErrorResponse'
 */
router.post("/", validate(semesterSchema), authenticate, authorize("ADMIN"), createSemester);

/**
 * @swagger
 * /api/semesters/{id}:
 *   put:
 *     summary: Update a semester
 *     description: >
 *       Updates an existing semester by ID. Requires the **ADMIN** role.
 *       The update endpoint does not run request schema validation middleware on all fields.
 *     tags:
 *       - Semesters
 *     operationId: updateSemester
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "cljk0x8s90009qzrmsy4a6b7c"
 *         description: Unique semester identifier.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSemesterRequest'
 *     responses:
 *       200:
 *         description: Semester updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               message: "Semester updated successfully."
 *               data:
 *                 id: "cljk0x8s90009qzrmsy4a6b7c"
 *                 name: "First Semester"
 *                 code: "SEM-1"
 *                 startDate: "2026-08-01T00:00:00.000Z"
 *                 endDate: "2026-12-15T00:00:00.000Z"
 *                 status: "ACTIVE"
 *                 createdAt: "2026-07-01T08:00:00.000Z"
 *                 updatedAt: "2026-08-15T09:30:00.000Z"
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
 *         description: Semester not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundResponse'
 *             example:
 *               success: false
 *               message: "Semester not found."
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
  updateSemester
);

/**
 * @swagger
 * /api/semesters/{id}:
 *   delete:
 *     summary: Delete a semester
 *     description: Deletes an existing semester by ID. Requires the **ADMIN** role.
 *     tags:
 *       - Semesters
 *     operationId: deleteSemester
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "cljk0x8s90009qzrmsy4a6b7c"
 *         description: Unique semester identifier.
 *     responses:
 *       200:
 *         description: Semester deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               message: "Semester deleted successfully."
 *               data:
 *                 id: "cljk0x8s90009qzrmsy4a6b7c"
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
 *         description: Semester not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundResponse'
 *             example:
 *               success: false
 *               message: "Semester not found."
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
  deleteSemester
);

/**
 * @swagger
 * /api/semesters:
 *   get:
 *     summary: Get all semesters
 *     description: Retrieves a paginated list of semesters with optional search and sorting.
 *     tags:
 *       - Semesters
 *     operationId: getAllSemesters
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
 *         description: Semesters retrieved successfully.
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
 *                 - id: "cljk0x8s90009qzrmsy4a6b7c"
 *                   name: "First Semester"
 *                   code: "SEM-1"
 *                   startDate: "2026-08-01T00:00:00.000Z"
 *                   endDate: "2026-12-15T00:00:00.000Z"
 *                   status: "UPCOMING"
 *                   createdAt: "2026-07-01T08:00:00.000Z"
 *                   updatedAt: "2026-07-01T08:00:00.000Z"
 *       401:
 *         description: Missing or invalid JWT access token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedResponse'
 *       403:
 *         description: Authenticated user does not have permission to view semesters.
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
router.get("/", authenticate, authorize("ADMIN", "TEACHER"), getAllSemesters);

/**
 * @swagger
 * /api/semesters/{id}:
 *   get:
 *     summary: Get semester by ID
 *     description: Retrieves a single semester by its unique identifier.
 *     tags:
 *       - Semesters
 *     operationId: getSemesterById
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "cljk0x8s90009qzrmsy4a6b7c"
 *         description: Unique semester identifier.
 *     responses:
 *       200:
 *         description: Semester retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               message: "Semester retrieved successfully."
 *               data:
 *                 id: "cljk0x8s90009qzrmsy4a6b7c"
 *                 name: "First Semester"
 *                 code: "SEM-1"
 *                 startDate: "2026-08-01T00:00:00.000Z"
 *                 endDate: "2026-12-15T00:00:00.000Z"
 *                 status: "ACTIVE"
 *                 createdAt: "2026-07-01T08:00:00.000Z"
 *                 updatedAt: "2026-08-15T09:30:00.000Z"
 *       401:
 *         description: Missing or invalid JWT access token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedResponse'
 *       403:
 *         description: Authenticated user does not have permission to view this semester.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ForbiddenResponse'
 *       404:
 *         description: Semester not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundResponse'
 *             example:
 *               success: false
 *               message: "Semester not found."
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
  getSemesterById
);

export default router;
