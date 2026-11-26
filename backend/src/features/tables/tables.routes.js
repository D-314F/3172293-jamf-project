import { Router } from "express";
import { tablesController } from "./tables.controller.js";

const router = Router();

// GET /api/tables -> Obtener todos los pisos y mesas activas
router.get("/", tablesController.getAll);

// POST /api/tables -> Crear nueva mesa en un piso
router.post("/", tablesController.createTable);

// POST /api/tables/floors -> Crear nuevo piso (ej. Segundo Piso)
router.post("/floors", tablesController.createFloor);

// PUT /api/tables/layout -> Guardar posiciones (pos_x, pos_y) y datos de las mesas
router.put("/layout", tablesController.updateLayout);

// DELETE /api/tables/:id -> Desactivar/eliminar una mesa
router.delete("/:id", tablesController.deleteTable);

export default router;
