import { Router } from "express";
import authenticateToken from "../../middlewares/auth.middleware.js";
import { uploadSingleImage } from "./upload.middleware.js";
import { uploadController } from "./upload.controller.js";

const router = Router();

// GET /api/uploads -> Listar metadatos multimedia registrados (Protegido)
router.get("/", authenticateToken, uploadController.getAll);

// POST /api/uploads/:folder -> Subir imagen a uploads/{users,products,providers} vía temp/ (Protegido)
router.post("/:folder", authenticateToken, uploadSingleImage, uploadController.uploadImage);

export default router;
