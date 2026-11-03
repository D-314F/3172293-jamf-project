import { Router } from "express";
import { providerController } from "./provider.controller.js";

const router = Router();

// GET /api/providers -> Listar todos
router.get("/", providerController.getAll);

// POST /api/providers -> Crear
router.post("/", providerController.create);

// GET /api/providers/:id -> Ver detalle / editar
router.get("/:id", providerController.getById);

// PUT /api/providers/:id -> Actualizar
router.put("/:id", providerController.update);

export default router;