import express from "express";
import permissionsController from "./permissions.controller.js";

const router = express.Router();

router.get("/", permissionsController.getAllPermissions);
router.get("/user/:userId", permissionsController.getUserPermissions);
router.put("/user/:userId", permissionsController.updateUserPermissions);

export default router;