import express from "express";
import accessController from "./access.controller.js";
import authenticateToken from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/check/:permissionCode", authenticateToken, accessController.checkPermission);

export default router;