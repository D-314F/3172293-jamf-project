import { inventoryService } from "./inventory.service.js";

export const inventoryController = {
    async create(req, res) {
        try {
            const item = await inventoryService.createInventory(req.body);

            res.status(201).json({
                message: "Producto de inventario creado correctamente",
                inventoryId: item.id,
            });
        } catch (err) {
            console.error("ERROR BACKEND (INVENTORY):", err.message);

            if (err.code === "23505") {
                return res.status(409).json({
                    error: "Ya existe un producto con ese código único (ID)",
                });
            }

            res.status(500).json({ error: "Error interno del servidor al crear el inventario" });
        }
    },
};