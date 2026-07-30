import express from "express";

import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../controllers/student.controller.js";
import {
  authenticate,
  authorize,
} from "../middleware/auth.middleware.js";
import validate from "../validators/validation.middleware.js";
import { studentSchema } from "../validators/student.validator.js";

const router = express.Router();

/**
 * @swagger
 * /api/students:
 *   post:
 *     summary: Create a student
 *     description: >
 *       Creates a new student record in the system. Requires the **ADMIN** role.
 *       The payload creates both a User account and the student's academic profile.
 *     tags:
 *       - Students
 *     operationId: createStudent
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateStudentRequest'
 *     responses:
 *       201:
 *         description: Student created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               message: "Student created successfully."
 *               data:
 *                 id: "cljk0z5t70010qzrmte6u8v9w"
 *                 registrationNumber: "FA22-BCS-001"
 *                 gender: "MALE"
 *                 phone: "+923001234567"
 *                 address: "House 12, Street 4, F-10, Islamabad"
 *                 dateOfBirth: "2003-05-14T00:00:00.000Z"
 *                 profileImage: "https://cdn.university.edu/profiles/muhammad-ali.jpg"
 *                 isActive: true
 *                 userId: "cljk0a1b20000qzrm5f8g2h3i"
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
 *               message: "\"email\" must be a valid email."
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
 *         description: Student already exists.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConflictResponse'
 *             example:
 *               success: false
 *               message: "Student already exists."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerErrorResponse'
 */
router.post("/", validate(studentSchema), authenticate, authorize("ADMIN"), createStudent);

/**
 * @swagger
 * /api/students/{id}:
 *   put:
 *     summary: Update a student
 *     description: >
 *       Updates an existing student by ID. Requires the **ADMIN** role.
 *       The update endpoint does not run request schema validation middleware on all fields.
 *     tags:
 *       - Students
 *     operationId: updateStudent
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "cljk0z5t70010qzrmte6u8v9w"
 *         description: Unique student identifier.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateStudentRequest'
 *     responses:
 *       200:
 *         description: Student updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               message: "Student updated successfully."
 *               data:
 *                 id: "cljk0z5t70010qzrmte6u8v9w"
 *                 registrationNumber: "FA22-BCS-001"
 *                 gender: "MALE"
 *                 phone: "+923001234567"
 *                 address: "House 12, Street 4, F-10, Islamabad"
 *                 dateOfBirth: "2003-05-14T00:00:00.000Z"
 *                 profileImage: "https://cdn.university.edu/profiles/muhammad-ali.jpg"
 *                 isActive: true
 *                 userId: "cljk0a1b20000qzrm5f8g2h3i"
 *                 departmentId: "cljk0g7h80003qzrmbl3m8n9o"
 *                 createdAt: "2026-01-15T09:30:00.000Z"
 *                 updatedAt: "2026-06-20T11:00:00.000Z"
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
 *         description: Student not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundResponse'
 *             example:
 *               success: false
 *               message: "Student not found."
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
  updateStudent
);

/**
 * @swagger
 * /api/students/{id}:
 *   delete:
 *     summary: Delete a student
 *     description: Deletes an existing student by ID. Requires the **ADMIN** role.
 *     tags:
 *       - Students
 *     operationId: deleteStudent
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "cljk0z5t70010qzrmte6u8v9w"
 *         description: Unique student identifier.
 *     responses:
 *       200:
 *         description: Student deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               message: "Student deleted successfully."
 *               data:
 *                 id: "cljk0z5t70010qzrmte6u8v9w"
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
 *         description: Student not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundResponse'
 *             example:
 *               success: false
 *               message: "Student not found."
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
  deleteStudent
);

/**
 * @swagger
 * /api/students:
 *   get:
 *     summary: Get all students
 *     description: Retrieves a paginated list of students with optional search and sorting.
 *     tags:
 *       - Students
 *     operationId: getAllStudents
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
 *         description: Students retrieved successfully.
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
 *                 - id: "cljk0z5t70010qzrmte6u8v9w"
 *                   registrationNumber: "FA22-BCS-001"
 *                   gender: "MALE"
 *                   phone: "+923001234567"
 *                   address: "House 12, Street 4, F-10, Islamabad"
 *                   dateOfBirth: "2003-05-14T00:00:00.000Z"
 *                   profileImage: "https://cdn.university.edu/profiles/muhammad-ali.jpg"
 *                   isActive: true
 *                   userId: "cljk0a1b20000qzrm5f8g2h3i"
 *                   departmentId: "cljk0g7h80003qzrmbl3m8n9o"
 *                   createdAt: "2026-01-15T09:30:00.000Z"
 *                   updatedAt: "2026-07-01T09:30:00.000Z"
 *       401:
 *         description: Missing or invalid JWT access token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedResponse'
 *       403:
 *         description: Authenticated user does not have permission to view students.
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
router.get("/", authenticate, authorize("ADMIN", "TEACHER"), getAllStudents);

/**
 * @swagger
 * /api/students/{id}:
 *   get:
 *     summary: Get student by ID
 *     description: Retrieves a single student by their unique identifier.
 *     tags:
 *       - Students
 *     operationId: getStudentById
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "cljk0z5t70010qzrmte6u8v9w"
 *         description: Unique student identifier.
 *     responses:
 *       200:
 *         description: Student retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               message: "Student retrieved successfully."
 *               data:
 *                 id: "cljk0z5t70010qzrmte6u8v9w"
 *                 registrationNumber: "FA22-BCS-001"
 *                 gender: "MALE"
 *                 phone: "+923001234567"
 *                 address: "House 12, Street 4, F-10, Islamabad"
 *                 dateOfBirth: "2003-05-14T00:00:00.000Z"
 *                 profileImage: "https://cdn.university.edu/profiles/muhammad-ali.jpg"
 *                 isActive: true
 *                 userId: "cljk0a1b20000qzrm5f8g2h3i"
 *                 departmentId: "cljk0g7h80003qzrmbl3m8n9o"
 *                 createdAt: "2026-01-15T09:30:00.000Z"
 *                 updatedAt: "2026-07-01T09:30:00.000Z"
 *       401:
 *         description: Missing or invalid JWT access token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedResponse'
 *       403:
 *         description: Authenticated user does not have permission to view this student.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ForbiddenResponse'
 *       404:
 *         description: Student not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundResponse'
 *             example:
 *               success: false
 *               message: "Student not found."
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
  getStudentById
);

export default router;