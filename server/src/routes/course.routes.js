import express from "express";

import {
  createCourse,
  deleteCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
} from "../controllers/course.controller.js";
import {
  authenticate,
  authorize,
} from "../middleware/auth.middleware.js";
import validate from "../validators/validation.middleware.js";
import { courseSchema } from "../validators/course.validator.js";

const router = express.Router();

/**
 * @swagger
 * /api/courses:
 *   post:
 *     summary: Create a course
 *     description: >
 *       Creates a new degree program (course) within a department. Requires the **ADMIN** role.
 *       Both `name` and `code` must be unique across all courses.
 *     tags:
 *       - Courses
 *     operationId: createCourse
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCourseRequest'
 *     responses:
 *       201:
 *         description: Course created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               message: "Course created successfully."
 *               data:
 *                 id: "cljk0i9j00004qzrmdn5o0p1q"
 *                 name: "BS Computer Science"
 *                 code: "BSCS"
 *                 durationYears: 4
 *                 totalSemesters: 8
 *                 departmentId: "cljk0g7h80003qzrmbl3m8n9o"
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
 *               message: "\"durationYears\" must be a positive integer."
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
 *         description: A course with this name or code already exists.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConflictResponse'
 *             example:
 *               success: false
 *               message: "A course with this name or code already exists."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerErrorResponse'
 */
router.post("/", validate(courseSchema), authenticate, authorize("ADMIN"), createCourse);

/**
 * @swagger
 * /api/courses/{id}:
 *   put:
 *     summary: Update a course
 *     description: >
 *       Updates an existing course by ID. Requires the **ADMIN** role.
 *       Note: this endpoint does not run schema validation middleware on the request
 *       body (unlike the create endpoint) — refer to the course controller for
 *       exactly which fields are processed on update.
 *     tags:
 *       - Courses
 *     operationId: updateCourse
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "cljk0i9j00004qzrmdn5o0p1q"
 *         description: Unique CUID identifier of the course.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCourseRequest'
 *     responses:
 *       200:
 *         description: Course updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               message: "Course updated successfully."
 *               data:
 *                 id: "cljk0i9j00004qzrmdn5o0p1q"
 *                 name: "BS Computer Science"
 *                 code: "BSCS"
 *                 durationYears: 4
 *                 totalSemesters: 8
 *                 departmentId: "cljk0g7h80003qzrmbl3m8n9o"
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
 *         description: No course exists with the given ID.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundResponse'
 *             example:
 *               success: false
 *               message: "Course not found."
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
  updateCourse
);

/**
 * @swagger
 * /api/courses/{id}:
 *   delete:
 *     summary: Delete a course
 *     description: Deletes an existing course by ID. Requires the **ADMIN** role.
 *     tags:
 *       - Courses
 *     operationId: deleteCourse
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "cljk0i9j00004qzrmdn5o0p1q"
 *         description: Unique CUID identifier of the course.
 *     responses:
 *       200:
 *         description: Course deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               message: "Course deleted successfully."
 *               data:
 *                 id: "cljk0i9j00004qzrmdn5o0p1q"
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
 *         description: No course exists with the given ID.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundResponse'
 *             example:
 *               success: false
 *               message: "Course not found."
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
  deleteCourse
);

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: List courses
 *     description: >
 *       Retrieves a paginated list of courses with optional search and sorting.
 *       Requires the **ADMIN** or **TEACHER** role.
 *     tags:
 *       - Courses
 *     operationId: getAllCourses
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
 *         description: Courses retrieved successfully.
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
 *                 - id: "cljk0i9j00004qzrmdn5o0p1q"
 *                   name: "BS Computer Science"
 *                   code: "BSCS"
 *                   durationYears: 4
 *                   totalSemesters: 8
 *                   departmentId: "cljk0g7h80003qzrmbl3m8n9o"
 *                   createdAt: "2026-01-15T09:30:00.000Z"
 *                   updatedAt: "2026-01-15T09:30:00.000Z"
 *                 - id: "cljk0i9j00004qzrmdn5o0p1z"
 *                   name: "BS Software Engineering"
 *                   code: "BSSE"
 *                   durationYears: 4
 *                   totalSemesters: 8
 *                   departmentId: "cljk0g7h80003qzrmbl3m8n9o"
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
router.get("/", authenticate, authorize("ADMIN", "TEACHER"), getAllCourses);

/**
 * @swagger
 * /api/courses/{id}:
 *   get:
 *     summary: Get course by ID
 *     description: >
 *       Retrieves a single course by its unique identifier.
 *       Requires the **ADMIN** or **TEACHER** role.
 *     tags:
 *       - Courses
 *     operationId: getCourseById
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "cljk0i9j00004qzrmdn5o0p1q"
 *         description: Unique CUID identifier of the course.
 *     responses:
 *       200:
 *         description: Course retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               message: "Course retrieved successfully."
 *               data:
 *                 id: "cljk0i9j00004qzrmdn5o0p1q"
 *                 name: "BS Computer Science"
 *                 code: "BSCS"
 *                 durationYears: 4
 *                 totalSemesters: 8
 *                 departmentId: "cljk0g7h80003qzrmbl3m8n9o"
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
 *         description: No course exists with the given ID.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundResponse'
 *             example:
 *               success: false
 *               message: "Course not found."
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
  getCourseById
);

export default router;