import { menuService } from "./menu.service.js";

export const menuController = {
    // Controlador para listar el menú
    async getMenu(req, res) {
        try {
            const dishes = await menuService.getAllDishes();
            return res.status(200).json(dishes);
        } catch (error) {
            console.error("Error en menuController.getMenu:", error);
            return res.status(500).json({ message: "Error interno al obtener el menú" });
        }
    },

    // Controlador para actualizar el estado del platillo desde el switch
    async updateStatus(req, res) {
        try {
            const { id } = req.params;
            const { is_active } = req.body;

            const updatedDish = await menuService.updateDishStatus(id, is_active);
            return res.status(200).json({
                message: "Estado del platillo actualizado correctamente",
                dish: updatedDish,
            });
        } catch (error) {
            console.error("Error en menuController.updateStatus:", error);
            if (error.message.includes("no encontrado")) {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: "Error interno al actualizar el estado" });
        }
    }
};