import { Router } from "express";
import { inventoryController } from "./inventory.controller.js";

const router = Router();

// GET /api/inventory -> Listar todos
router.get("/", inventoryController.getAll);

// POST /api/inventory -> Crear
router.post("/", inventoryController.create);

// GET /api/inventory/:id -> Ver detalle / editar
router.get("/:id", inventoryController.getById);

// PUT /api/inventory/:id -> Actualizar
router.put("/:id", inventoryController.update);

export default router;