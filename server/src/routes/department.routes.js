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

/**
 * @swagger
 * /api/departments:
 *   post:
 *     summary: Create a department
 *     description: >
 *       Creates a new academic department. Requires the **ADMIN** role.
 *       Both `name` and `code` must be unique across all departments.
 *     tags:
 *       - Departments
 *     operationId: createDepartment
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDepartmentRequest'
 *     responses:
 *       201:
 *         description: Department created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               message: "Department created successfully."
 *               data:
 *                 id: "cljk0g7h80003qzrmbl3m8n9o"
 *                 name: "Computer Science"
 *                 code: "CS"
 *                 description: "Department of Computer Science, offering undergraduate and graduate programs in software engineering, AI, and systems."
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
 *               message: "\"code\" is required."
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
 *         description: A department with this name or code already exists.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConflictResponse'
 *             example:
 *               success: false
 *               message: "A department with this name or code already exists."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerErrorResponse'
 */
router.post("/", validate(departmentSchema), authenticate, authorize("ADMIN"), createDepartment);

/**
 * @swagger
 * /api/departments/{id}:
 *   put:
 *     summary: Update a department
 *     description: >
 *       Updates an existing department by ID. Requires the **ADMIN** role.
 *       Note: this endpoint does not run schema validation middleware on the request
 *       body (unlike the create endpoint) — refer to the department controller for
 *       exactly which fields are processed on update.
 *     tags:
 *       - Departments
 *     operationId: updateDepartment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "cljk0g7h80003qzrmbl3m8n9o"
 *         description: Unique CUID identifier of the department.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDepartmentRequest'
 *     responses:
 *       200:
 *         description: Department updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               message: "Department updated successfully."
 *               data:
 *                 id: "cljk0g7h80003qzrmbl3m8n9o"
 *                 name: "Computer Science"
 *                 code: "CS"
 *                 description: "Department of Computer Science, offering undergraduate and graduate programs in software engineering, AI, and systems."
 *                 createdAt: "2026-01-15T09:30:00.000Z"
 *                 updatedAt: "2026-02-01T11:00:00.000Z"
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
 *         description: No department exists with the given ID.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundResponse'
 *             example:
 *               success: false
 *               message: "Department not found."
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
  updateDepartment
);

/**
 * @swagger
 * /api/departments/{id}:
 *   delete:
 *     summary: Delete a department
 *     description: Deletes an existing department by ID. Requires the **ADMIN** role.
 *     tags:
 *       - Departments
 *     operationId: deleteDepartment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "cljk0g7h80003qzrmbl3m8n9o"
 *         description: Unique CUID identifier of the department.
 *     responses:
 *       200:
 *         description: Department deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               message: "Department deleted successfully."
 *               data:
 *                 id: "cljk0g7h80003qzrmbl3m8n9o"
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
 *         description: No department exists with the given ID.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundResponse'
 *             example:
 *               success: false
 *               message: "Department not found."
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
  deleteDepartment
);

/**
 * @swagger
 * /api/departments:
 *   get:
 *     summary: List departments
 *     description: >
 *       Retrieves a paginated list of departments with optional search and sorting.
 *       Requires the **ADMIN** or **TEACHER** role.
 *     tags:
 *       - Departments
 *     operationId: getAllDepartments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - $ref: '#/components/parameters/SearchParam'
 *       - $ref: '#/components/parameters/SortByParam'
 *       - $ref: '#/components/parameters/SortOrderParam'
 *     responses:
 *       200:
 *         description: Departments retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *             example:
 *               success: true
 *               pagination:
 *                 page: 1
 *                 limit: 10
 *                 total: 2
 *                 totalPages: 1
 *               data:
 *                 - id: "cljk0g7h80003qzrmbl3m8n9o"
 *                   name: "Computer Science"
 *                   code: "CS"
 *                   description: "Department of Computer Science, offering undergraduate and graduate programs in software engineering, AI, and systems."
 *                   createdAt: "2026-01-15T09:30:00.000Z"
 *                   updatedAt: "2026-01-15T09:30:00.000Z"
 *                 - id: "cljk0g7h80003qzrmbl3m8n9z"
 *                   name: "Electrical Engineering"
 *                   code: "EE"
 *                   description: "Department of Electrical Engineering."
 *                   createdAt: "2026-01-16T09:30:00.000Z"
 *                   updatedAt: "2026-01-16T09:30:00.000Z"
 *       401:
 *         description: Missing or invalid JWT access token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedResponse'
 *       403:
 *         description: Authenticated user does not have the ADMIN or TEACHER role.
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
router.get("/", authenticate, authorize("ADMIN", "TEACHER"), getAllDepartments);

/**
 * @swagger
 * /api/departments/{id}:
 *   get:
 *     summary: Get department by ID
 *     description: >
 *       Retrieves a single department by its unique identifier.
 *       Requires the **ADMIN** or **TEACHER** role.
 *     tags:
 *       - Departments
 *     operationId: getDepartmentById
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "cljk0g7h80003qzrmbl3m8n9o"
 *         description: Unique CUID identifier of the department.
 *     responses:
 *       200:
 *         description: Department retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               message: "Department retrieved successfully."
 *               data:
 *                 id: "cljk0g7h80003qzrmbl3m8n9o"
 *                 name: "Computer Science"
 *                 code: "CS"
 *                 description: "Department of Computer Science, offering undergraduate and graduate programs in software engineering, AI, and systems."
 *                 createdAt: "2026-01-15T09:30:00.000Z"
 *                 updatedAt: "2026-01-15T09:30:00.000Z"
 *       401:
 *         description: Missing or invalid JWT access token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedResponse'
 *       403:
 *         description: Authenticated user does not have the ADMIN or TEACHER role.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ForbiddenResponse'
 *       404:
 *         description: No department exists with the given ID.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundResponse'
 *             example:
 *               success: false
 *               message: "Department not found."
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
  getDepartmentById
);

export default router;