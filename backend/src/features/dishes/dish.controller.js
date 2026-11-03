import { dishService } from "./dish.service.js";

export const dishController = {
    async getAll(req, res) {
        try {
            const dishes = await dishService.getAllDishes();
            return res.status(200).json(dishes);
        } catch (err) {
            console.error("ERROR AL LISTAR PLATILLOS:", err.message);
            return res.status(500).json({ error: err.message });
        }
    },

    async getById(req, res) {
        try {
            const { id } = req.params;
            const dish = await dishService.getDishById(id);
            return res.status(200).json(dish);
        } catch (err) {
            console.error("ERROR AL OBTENER PLATILLO:", err.message);
            return res.status(404).json({ error: err.message });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const updatedDish = await dishService.updateDish(id, req.body);
            return res.status(200).json({
                message: "Platillo actualizado correctamente",
                dishId: updatedDish.id,
            });
        } catch (err) {
            console.error("ERROR AL ACTUALIZAR PLATILLO:", err.message);
            return res.status(500).json({ error: err.message });
        }
    },

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