import { Router } from "express";
import { inventoryController } from "./inventory.controller.js";

const router = Router();

// POST /api/inventory
router.post("/", inventoryController.create);

export default router;