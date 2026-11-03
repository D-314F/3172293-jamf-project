import { Router } from "express";
import { userController } from "./user.controller.js";

const router = Router();

// GET /api/users -> Listar todos los usuarios
router.get("/", userController.getAll);

// POST /api/users -> Crear usuario
router.post("/", userController.create);

// GET /api/users/:id -> Obtener usuario por ID (Ver detalle / Editar)
router.get("/:id", userController.getById);

// PUT /api/users/:id -> Actualizar usuario
router.put("/:id", userController.update);

export default router;