import { Router } from "express";
import { userController } from "./user.controller.js";
import authenticateToken from "../../middlewares/auth.middleware.js";

const router = Router();

// GET /api/users -> Listar todos los usuarios (Protegido)
router.get("/", authenticateToken, userController.getAll);

// POST /api/users -> Crear usuario (Público para auto-registro / Admin)
router.post("/", userController.create);

// GET /api/users/:id -> Obtener usuario por ID (Protegido)
router.get("/:id", authenticateToken, userController.getById);

// PUT /api/users/:id -> Actualizar usuario (Protegido)
router.put("/:id", authenticateToken, userController.update);

export default router;