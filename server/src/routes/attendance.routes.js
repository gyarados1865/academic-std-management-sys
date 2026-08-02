import express from "express";

import {
  createAttendance,
  deleteAttendance,
  getAllAttendances,
  getAttendanceById,
  updateAttendance,
} from "../controllers/attendance.controller.js";
import {
  authenticate,
  authorize,
} from "../middleware/auth.middleware.js";
import validate from "../validators/validation.middleware.js";
import { attendanceSchema } from "../validators/attendance.validator.js";

const router = express.Router();

/**
 * @swagger
 * /api/attendances:
 *   post:
 *     summary: Create an attendance record
 *     description: >
 *       Creates a new attendance record for a student in a subject on a given date.
 *       Requires the **ADMIN** role. A student can only have one attendance record
 *       per subject per date (enforced by a unique constraint on studentId, subjectId, date).
 *     tags:
 *       - Attendance
 *     operationId: createAttendance
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAttendanceRequest'
 *     responses:
 *       201:
 *         description: Attendance record created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               message: "Attendance recorded successfully."
 *               data:
 *                 id: "cljk0q7r80008qzrmlv3w8x9y"
 *                 studentId: "cljk0c3d40001qzrm7h9i4j5k"
 *                 subjectId: "cljk0m3n40006qzrmhr9s4t5u"
 *                 date: "2026-07-15T00:00:00.000Z"
 *                 status: "PRESENT"
 *                 createdAt: "2026-07-15T09:05:00.000Z"
 *                 updatedAt: "2026-07-15T09:05:00.000Z"
 *       400:
 *         description: Validation error — one or more fields failed validation.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *             example:
 *               success: false
 *               message: "\"status\" must be one of [PRESENT, ABSENT, LATE]."
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
 *         description: An attendance record already exists for this student, subject, and date.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConflictResponse'
 *             example:
 *               success: false
 *               message: "Attendance record already exists for this student, subject, and date."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerErrorResponse'
 */
router.post("/", validate(attendanceSchema), authenticate, authorize("ADMIN"), createAttendance);

/**
 * @swagger
 * /api/attendances/{id}:
 *   put:
 *     summary: Update an attendance record
 *     description: >
 *       Updates an existing attendance record by ID. Requires the **ADMIN** role.
 *       Note: this endpoint does not run schema validation middleware on the request
 *       body (unlike the create endpoint) — refer to the attendance controller for
 *       exactly which fields are processed on update.
 *     tags:
 *       - Attendance
 *     operationId: updateAttendance
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "cljk0q7r80008qzrmlv3w8x9y"
 *         description: Unique CUID identifier of the attendance record.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAttendanceRequest'
 *     responses:
 *       200:
 *         description: Attendance record updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               message: "Attendance record updated successfully."
 *               data:
 *                 id: "cljk0q7r80008qzrmlv3w8x9y"
 *                 studentId: "cljk0c3d40001qzrm7h9i4j5k"
 *                 subjectId: "cljk0m3n40006qzrmhr9s4t5u"
 *                 date: "2026-07-15T00:00:00.000Z"
 *                 status: "LATE"
 *                 createdAt: "2026-07-15T09:05:00.000Z"
 *                 updatedAt: "2026-07-15T10:12:00.000Z"
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
 *         description: No attendance record exists with the given ID.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundResponse'
 *             example:
 *               success: false
 *               message: "Attendance record not found."
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
  updateAttendance
);

/**
 * @swagger
 * /api/attendances/{id}:
 *   delete:
 *     summary: Delete an attendance record
 *     description: Deletes an existing attendance record by ID. Requires the **ADMIN** role.
 *     tags:
 *       - Attendance
 *     operationId: deleteAttendance
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "cljk0q7r80008qzrmlv3w8x9y"
 *         description: Unique CUID identifier of the attendance record.
 *     responses:
 *       200:
 *         description: Attendance record deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               message: "Attendance record deleted successfully."
 *               data:
 *                 id: "cljk0q7r80008qzrmlv3w8x9y"
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
 *         description: No attendance record exists with the given ID.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundResponse'
 *             example:
 *               success: false
 *               message: "Attendance record not found."
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
  deleteAttendance
);

/**
 * @swagger
 * /api/attendances:
 *   get:
 *     summary: List attendance records
 *     description: >
 *       Retrieves a paginated list of attendance records with optional search and sorting.
 *       Requires the **ADMIN** or **TEACHER** role.
 *     tags:
 *       - Attendance
 *     operationId: getAllAttendances
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
 *         description: Attendance records retrieved successfully.
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
 *                 - id: "cljk0q7r80008qzrmlv3w8x9y"
 *                   studentId: "cljk0c3d40001qzrm7h9i4j5k"
 *                   subjectId: "cljk0m3n40006qzrmhr9s4t5u"
 *                   date: "2026-07-15T00:00:00.000Z"
 *                   status: "PRESENT"
 *                   createdAt: "2026-07-15T09:05:00.000Z"
 *                   updatedAt: "2026-07-15T09:05:00.000Z"
 *                 - id: "cljk0q7r80008qzrmlv3w8x9z"
 *                   studentId: "cljk0c3d40001qzrm7h9i4j5k"
 *                   subjectId: "cljk0m3n40006qzrmhr9s4t5u"
 *                   date: "2026-07-16T00:00:00.000Z"
 *                   status: "ABSENT"
 *                   createdAt: "2026-07-16T09:05:00.000Z"
 *                   updatedAt: "2026-07-16T09:05:00.000Z"
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
router.get("/", authenticate, authorize("ADMIN", "TEACHER"), getAllAttendances);

/**
 * @swagger
 * /api/attendances/{id}:
 *   get:
 *     summary: Get attendance record by ID
 *     description: >
 *       Retrieves a single attendance record by its unique identifier.
 *       Requires the **ADMIN** or **TEACHER** role.
 *     tags:
 *       - Attendance
 *     operationId: getAttendanceById
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "cljk0q7r80008qzrmlv3w8x9y"
 *         description: Unique CUID identifier of the attendance record.
 *     responses:
 *       200:
 *         description: Attendance record retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               message: "Attendance record retrieved successfully."
 *               data:
 *                 id: "cljk0q7r80008qzrmlv3w8x9y"
 *                 studentId: "cljk0c3d40001qzrm7h9i4j5k"
 *                 subjectId: "cljk0m3n40006qzrmhr9s4t5u"
 *                 date: "2026-07-15T00:00:00.000Z"
 *                 status: "PRESENT"
 *                 createdAt: "2026-07-15T09:05:00.000Z"
 *                 updatedAt: "2026-07-15T09:05:00.000Z"
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
 *         description: No attendance record exists with the given ID.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundResponse'
 *             example:
 *               success: false
 *               message: "Attendance record not found."
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
  getAttendanceById
);

export default router;