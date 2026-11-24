import express from "express";
import permissionsController from "./permissions.controller.js";
import authenticateToken from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", authenticateToken, permissionsController.getAllPermissions);
router.get("/user/:userId", authenticateToken, permissionsController.getUserPermissions);
router.put("/user/:userId", authenticateToken, permissionsController.updateUserPermissions);

export default router;
