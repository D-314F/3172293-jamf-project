import { inventoryService } from "./inventory.service.js";

export const inventoryController = {
    async getAll(req, res) {
        try {
            const items = await inventoryService.getAllInventory();
            return res.status(200).json(items);
        } catch (err) {
            console.error("ERROR AL LISTAR INVENTARIO:", err.message);
            return res.status(500).json({ error: err.message });
        }
    },

    async getById(req, res) {
        try {
            const { id } = req.params;
            const item = await inventoryService.getInventoryById(id);
            return res.status(200).json(item);
        } catch (err) {
            console.error("ERROR AL OBTENER PRODUCTO:", err.message);
            return res.status(404).json({ error: err.message });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const updated = await inventoryService.updateInventory(id, req.body);
            return res.status(200).json({
                message: "Producto de inventario actualizado correctamente",
                inventoryId: updated.id,
            });
        } catch (err) {
            console.error("ERROR AL ACTUALIZAR INVENTARIO:", err.message);
            return res.status(500).json({ error: err.message });
        }
    },

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