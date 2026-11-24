import express from "express";
import groupsController from "./groups.controller.js";
import authenticateToken from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", authenticateToken, groupsController.getAllGroups);
router.get("/:groupId/permissions", authenticateToken, groupsController.getGroupPermissions);
router.put("/:groupId/permissions", authenticateToken, groupsController.updateGroupPermissions);

export default router;
