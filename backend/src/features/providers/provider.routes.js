import { Router } from "express";
import { providerController } from "./provider.controller.js";

const router = Router();

// POST /api/providers
router.post("/", providerController.create);

export default router;