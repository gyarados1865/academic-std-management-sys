import { Router } from "express";
import { register, login } from "../controllers/auth.controller.js";
import {
  authenticate,
  authorize,
} from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticate, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Protected route accessed successfully",
    user: req.user,
  });
});

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
