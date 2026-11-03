import { Router } from "express";
import { orderController } from "./order.controller.js";

const router = Router();

// GET /api/orders -> Listar todas las órdenes
router.get("/", orderController.getAll);

// POST /api/orders -> Crear orden
router.post("/", orderController.create);

// GET /api/orders/:id -> Obtener orden por ID
router.get("/:id", orderController.getById);

// PUT /api/orders/:id -> Actualizar orden
router.put("/:id", orderController.update);

export default router;