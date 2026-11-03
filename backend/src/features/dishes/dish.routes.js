import { Router } from "express";
import { dishController } from "./dish.controller.js";

const router = Router();

// GET /api/dishes -> Listar todos los platillos
router.get("/", dishController.getAll);

// POST /api/dishes -> Crear platillo
router.post("/", dishController.create);

// GET /api/dishes/:id -> Obtener platillo por ID
router.get("/:id", dishController.getById);

// PUT /api/dishes/:id -> Actualizar platillo
router.put("/:id", dishController.update);

export default router;