import { Router } from "express";
import { dishController } from "./dish.controller.js";

const router = Router();

// POST /api/dishes
router.post("/", dishController.create);

export default router;