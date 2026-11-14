import { Router } from "express";
import { authController } from "./auth.controller.js";
import authenticateToken from "../../middlewares/auth.middleware.js";

const router = Router();

// POST /api/auth/login
router.post("/login", authController.login);

// GET /api/auth/profile
router.get("/profile", authenticateToken, authController.getProfile);

// PUT /api/auth/profile
router.put("/profile", authenticateToken, authController.updateProfile);

export default router;