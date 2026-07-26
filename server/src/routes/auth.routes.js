import { Router } from "express";

const router = Router();

// Temporary route
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Authentication routes are working",
  });
});

export default router;