import { Router } from "express";
import { menuController } from "./menu.controller.js";

const router = Router();

// GET /api/menu -> Obtener todos los platillos del menú
router.get("/", menuController.getMenu);

// PATCH /api/menu/:id/status -> Actualizar el estado (activo/inactivo) del platillo
router.patch("/:id/status", menuController.updateStatus);

export default router;