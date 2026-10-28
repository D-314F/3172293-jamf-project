import { providerService } from "./provider.service.js";

export const providerController = {
    async create(req, res) {
        try {
            const provider = await providerService.createProvider(req.body);

            res.status(201).json({
                message: "Proveedor creado correctamente",
                providerId: provider.id,
            });
        } catch (err) {
            console.error("ERROR BACKEND (PROVIDERS):", err.message);

            if (err.code === "23505") {
                return res.status(409).json({
                    error: "Ya existe un proveedor con ese documento o correo",
                });
            }

            res.status(500).json({ error: "Error interno del servidor al crear el proveedor" });
        }
    },
};