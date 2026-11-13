import express from "express";
import groupsController from "./groups.controller.js";

const router = express.Router();

router.get("/", groupsController.getAllGroups);
router.get("/:groupId/permissions", groupsController.getGroupPermissions);
router.put("/:groupId/permissions", groupsController.updateGroupPermissions);

export default router;