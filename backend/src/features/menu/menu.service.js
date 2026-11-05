import { menuRepository } from "./menu.repository.js";

// Función de mapeo para estandarizar los campos que vienen de la BD
function mapDishFromDb(dish) {
    if (!dish) return null;
    return {
        id: dish.id,
        title: dish.title,
        description: dish.description,
        price: dish.price,
        category: dish.category,
        imageUrl: dish.image_url,
        image_url: dish.image_url, // Se dejan ambos por compatibilidad
        isActive: dish.is_active,
        is_active: dish.is_active, // Se dejan ambos por compatibilidad
    };
}

export const menuService = {
    // 1. Obtener todos los platillos mapeados
    async getAllDishes() {
        const dishes = await menuRepository.findAll();
        return dishes.map(mapDishFromDb);
    },

    // 2. Obtener un platillo por ID mapeado
    async getDishById(id) {
        const dish = await menuRepository.findById(id);
        if (!dish) {
            throw new Error("Platillo no encontrado en el menú");
        }
        return mapDishFromDb(dish);
    },

    // 3. Actualizar el estado (activo/inactivo)
    async updateDishStatus(id, isActive) {
        const updatedDish = await menuRepository.updateStatus(id, isActive);
        if (!updatedDish) {
            throw new Error("No se pudo actualizar el estado, platillo no encontrado");
        }
        return mapDishFromDb(updatedDish);
    }
};