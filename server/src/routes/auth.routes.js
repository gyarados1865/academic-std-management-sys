import { Router } from "express";
import { register, login } from "../controllers/auth.controller.js";
import {
  authenticate,
  authorize,
} from "../middleware/auth.middleware.js";
import validate from "../validators/validation.middleware.js";
import { loginSchema } from "../validators/auth.validator.js";

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: >
 *       Creates a new user account with the specified role (ADMIN, TEACHER, or STUDENT).
 *       This is a general-purpose account registration endpoint — creating a full
 *       student or teacher academic profile (with department, registration number, etc.)
 *       is handled separately via the Students/Teachers endpoints.
 *     tags:
 *       - Authentication
 *     operationId: registerUser
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               message: "User registered successfully."
 *               data:
 *                 id: "cljk0a1b20000qzrm5f8g2h3i"
 *                 name: "Muhammad Sibtain Khan"
 *                 email: "sibtain.khan@university.edu"
 *                 role: "ADMIN"
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
 *               message: "\"email\" must be a valid email address."
 *       409:
 *         description: A user with this email address already exists.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConflictResponse'
 *             example:
 *               success: false
 *               message: "A user with this email already exists."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerErrorResponse'
 */
router.post("/register", register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     description: Authenticates a user with email and password, returning a JWT access token for use on subsequent requests.
 *     tags:
 *       - Authentication
 *     operationId: loginUser
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               message: "Login successful."
 *               data:
 *                 token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNsamsCM..."
 *                 user:
 *                   id: "cljk0a1b20000qzrm5f8g2h3i"
 *                   name: "Muhammad Ali"
 *                   email: "muhammad.ali@university.edu"
 *                   role: "STUDENT"
 *       400:
 *         description: Validation error — one or more fields failed validation.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *             example:
 *               success: false
 *               message: "\"password\" is required."
 *       401:
 *         description: Email or password is incorrect.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedResponse'
 *             example:
 *               success: false
 *               message: "Invalid email or password."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerErrorResponse'
 */
router.post("/login", validate(loginSchema), login);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get authenticated user profile
 *     description: Returns the profile of the currently authenticated user, based on the JWT provided in the Authorization header.
 *     tags:
 *       - Authentication
 *     operationId: getAuthenticatedUser
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: >
 *                 Note: this endpoint returns the authenticated user under a `user` key,
 *                 not the standard `data` envelope used elsewhere in this API.
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Protected route accessed successfully"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *             example:
 *               success: true
 *               message: "Protected route accessed successfully"
 *               user:
 *                 id: "cljk0a1b20000qzrm5f8g2h3i"
 *                 name: "Muhammad Ali"
 *                 email: "muhammad.ali@university.edu"
 *                 role: "STUDENT"
 *                 createdAt: "2026-01-15T09:30:00.000Z"
 *                 updatedAt: "2026-01-15T09:30:00.000Z"
 *       401:
 *         description: Missing or invalid JWT access token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedResponse'
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerErrorResponse'
 */
router.get("/me", authenticate, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Protected route accessed successfully",
    user: req.user,
  });
});

/**
 * @swagger
 * /api/auth/admin:
 *   get:
 *     summary: Access admin-only route
 *     description: Sample protected route that grants access only to authenticated users with the ADMIN role.
 *     tags:
 *       - Authentication
 *     operationId: accessAdminRoute
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin access granted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Welcome Admin"
 *             example:
 *               success: true
 *               message: "Welcome Admin"
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
router.get(
  "/admin",
  authenticate,
  authorize("ADMIN"),
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome Admin",
    });
  }
);

/**
 * @swagger
 * /api/auth/teacher:
 *   get:
 *     summary: Access teacher route
 *     description: Sample protected route that grants access to authenticated users with the ADMIN or TEACHER role.
 *     tags:
 *       - Authentication
 *     operationId: accessTeacherRoute
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Teacher access granted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Welcome Teacher"
 *             example:
 *               success: true
 *               message: "Welcome Teacher"
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
router.get(
  "/teacher",
  authenticate,
  authorize("ADMIN", "TEACHER"),
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome Teacher",
    });
  }
);

/**
 * @swagger
 * /api/auth/student:
 *   get:
 *     summary: Access student route
 *     description: Sample protected route that grants access only to authenticated users with the STUDENT role.
 *     tags:
 *       - Authentication
 *     operationId: accessStudentRoute
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Student access granted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Welcome Student"
 *             example:
 *               success: true
 *               message: "Welcome Student"
 *       401:
 *         description: Missing or invalid JWT access token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedResponse'
 *       403:
 *         description: Authenticated user does not have the STUDENT role.
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
router.get(
  "/student",
  authenticate,
  authorize("STUDENT"),
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome Student",
    });
  }
);

export default router;