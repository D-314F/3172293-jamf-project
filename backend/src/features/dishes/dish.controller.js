import { dishService } from "./dish.service.js";

export const dishController = {
    async create(req, res) {
        try {
            const dish = await dishService.createDish(req.body);

            res.status(201).json({
                message: "Platillo creado correctamente",
                dishId: dish.id,
            });
        } catch (err) {
            console.error("ERROR BACKEND (DISHES):", err.message);
            res.status(500).json({ error: "Error interno del servidor al crear el platillo" });
        }
    },
};