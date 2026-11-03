import { providerService } from "./provider.service.js";

export const providerController = {
    async getAll(req, res) {
        try {
            const providers = await providerService.getAllProviders();
            return res.status(200).json(providers);
        } catch (err) {
            console.error("ERROR AL LISTAR PROVEEDORES:", err.message);
            return res.status(500).json({ error: err.message });
        }
    },

    async getById(req, res) {
        try {
            const { id } = req.params;
            const provider = await providerService.getProviderById(id);
            return res.status(200).json(provider);
        } catch (err) {
            console.error("ERROR AL OBTENER PROVEEDOR:", err.message);
            return res.status(404).json({ error: err.message });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const updated = await providerService.updateProvider(id, req.body);
            return res.status(200).json({
                message: "Proveedor actualizado correctamente",
                providerId: updated.id,
            });
        } catch (err) {
            console.error("ERROR AL ACTUALIZAR PROVEEDOR:", err.message);
            return res.status(500).json({ error: err.message });
        }
    },

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