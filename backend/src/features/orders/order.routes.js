import { Router } from "express";
import { orderController } from "./order.controller.js";

const router = Router();

// POST /api/orders
router.post("/", orderController.create);

export default router;