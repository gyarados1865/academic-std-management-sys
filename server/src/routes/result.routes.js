import express from "express";

import {
  createResult,
  deleteResult,
  getAllResults,
  getResultById,
  updateResult,
} from "../controllers/result.controller.js";
import {
  authenticate,
  authorize,
} from "../middleware/auth.middleware.js";
import validate from "../validators/validation.middleware.js";
import { resultSchema } from "../validators/result.validator.js";

const router = express.Router();

/**
 * @swagger
 * /api/results:
 *   post:
 *     summary: Create a result
 *     description: >
 *       Creates a new student result record in the system.
 *       Requires the **ADMIN** role and validates the payload against the result schema.
 *     tags:
 *       - Results
 *     operationId: createResult
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateResultRequest'
 *     responses:
 *       201:
 *         description: Result created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               message: "Result created successfully."
 *               data:
 *                 id: "cljk0v8k00005qzrmf2u2a0x1"
 *                 studentId: "cljk0g7h80003qzrmbl3m8n9o"
 *                 subjectId: "cljk0i9j00004qzrmdn5o0p1q"
 *                 marks: 85
 *                 totalMarks: 100
 *                 grade: "A"
 *                 remarks: "Excellent performance"
 *                 createdAt: "2026-03-10T14:00:00.000Z"
 *                 updatedAt: "2026-03-10T14:00:00.000Z"
 *       400:
 *         description: Validation error — one or more fields failed validation.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *             example:
 *               success: false
 *               message: "\"marks\" must be a positive number."
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
 *         description: A result record for the given student and subject already exists.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConflictResponse'
 *             example:
 *               success: false
 *               message: "Result already exists."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerErrorResponse'
 */
router.post("/", validate(resultSchema), authenticate, authorize("ADMIN"), createResult);

/**
 * @swagger
 * /api/results/{id}:
 *   put:
 *     summary: Update a result
 *     description: >
 *       Updates an existing result by ID. Requires the **ADMIN** role.
 *       The request body must match the result schema.
 *     tags:
 *       - Results
 *     operationId: updateResult
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "cljk0v8k00005qzrmf2u2a0x1"
 *         description: Unique result identifier.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateResultRequest'
 *     responses:
 *       200:
 *         description: Result updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               message: "Result updated successfully."
 *               data:
 *                 id: "cljk0v8k00005qzrmf2u2a0x1"
 *                 studentId: "cljk0g7h80003qzrmbl3m8n9o"
 *                 subjectId: "cljk0i9j00004qzrmdn5o0p1q"
 *                 marks: 90
 *                 totalMarks: 100
 *                 grade: "A"
 *                 remarks: "Updated performance review"
 *                 createdAt: "2026-03-10T14:00:00.000Z"
 *                 updatedAt: "2026-03-11T10:00:00.000Z"
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
 *         description: Result not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundResponse'
 *             example:
 *               success: false
 *               message: "Result not found."
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
  updateResult
);

/**
 * @swagger
 * /api/results/{id}:
 *   delete:
 *     summary: Delete a result
 *     description: Deletes an existing result by ID. Requires the **ADMIN** role.
 *     tags:
 *       - Results
 *     operationId: deleteResult
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "cljk0v8k00005qzrmf2u2a0x1"
 *         description: Unique result identifier.
 *     responses:
 *       200:
 *         description: Result deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               message: "Result deleted successfully."
 *               data:
 *                 id: "cljk0v8k00005qzrmf2u2a0x1"
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
 *         description: Result not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundResponse'
 *             example:
 *               success: false
 *               message: "Result not found."
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
  deleteResult
);

/**
 * @swagger
 * /api/results:
 *   get:
 *     summary: Get all results
 *     description: Retrieves a paginated list of results with optional search and sorting.
 *     tags:
 *       - Results
 *     operationId: getAllResults
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
 *         description: Results retrieved successfully.
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
 *                 - id: "cljk0v8k00005qzrmf2u2a0x1"
 *                   studentId: "cljk0g7h80003qzrmbl3m8n9o"
 *                   subjectId: "cljk0i9j00004qzrmdn5o0p1q"
 *                   marks: 85
 *                   totalMarks: 100
 *                   grade: "A"
 *                   remarks: "Excellent performance"
 *                   createdAt: "2026-03-10T14:00:00.000Z"
 *                   updatedAt: "2026-03-10T14:00:00.000Z"
 *       401:
 *         description: Missing or invalid JWT access token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedResponse'
 *       403:
 *         description: Authenticated user does not have permission to view results.
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
router.get("/", authenticate, authorize("ADMIN", "TEACHER"), getAllResults);

/**
 * @swagger
 * /api/results/{id}:
 *   get:
 *     summary: Get result by ID
 *     description: Retrieves a single result by its unique identifier.
 *     tags:
 *       - Results
 *     operationId: getResultById
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "cljk0v8k00005qzrmf2u2a0x1"
 *         description: Unique result identifier.
 *     responses:
 *       200:
 *         description: Result retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               message: "Result retrieved successfully."
 *               data:
 *                 id: "cljk0v8k00005qzrmf2u2a0x1"
 *                 studentId: "cljk0g7h80003qzrmbl3m8n9o"
 *                 subjectId: "cljk0i9j00004qzrmdn5o0p1q"
 *                 marks: 85
 *                 totalMarks: 100
 *                 grade: "A"
 *                 remarks: "Excellent performance"
 *                 createdAt: "2026-03-10T14:00:00.000Z"
 *                 updatedAt: "2026-03-10T14:00:00.000Z"
 *       401:
 *         description: Missing or invalid JWT access token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedResponse'
 *       403:
 *         description: Authenticated user does not have permission to view this result.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ForbiddenResponse'
 *       404:
 *         description: Result not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundResponse'
 *             example:
 *               success: false
 *               message: "Result not found."
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
  getResultById
);

export default router;
