import { dishRepository } from "./dish.repository.js";

function mapDishFromDb(dish) {
    return {
        id: dish.id,
        dishName: dish.dish_name,
        nombre: dish.dish_name,
        category: dish.dish_category,
        dishCategory: dish.dish_category,
        categoria: dish.dish_category,
        price: Number(dish.dish_price),
        dishPrice: String(dish.dish_price),
        precio: String(dish.dish_price),
        description: dish.dish_description,
        dishDescription: dish.dish_description,
        descripcion: dish.dish_description,
        dishImageUrl: dish.dish_image_url || null,
        isActive: dish.is_active,
        activo: dish.is_active,
        status: dish.is_active ? "Habilitado" : "Deshabilitado",
    };
}

export const dishService = {
    async getAllDishes() {
        const dishes = await dishRepository.findAll();
        return dishes.map(mapDishFromDb);
    },

    async getDishById(id) {
        const dish = await dishRepository.findById(id);
        if (!dish) {
            throw new Error("Platillo no encontrado");
        }
        return mapDishFromDb(dish);
    },

    async updateDish(id, data) {
        const existing = await dishRepository.findById(id);
        if (!existing) {
            throw new Error("Platillo no encontrado");
        }

        const dishData = {
            dishName:
                data.dishName ?? data.nombre ?? data.dish_name ?? existing.dish_name,
            dishPrice:
                data.dishPrice !== undefined || data.precio !== undefined
                    ? Number(data.dishPrice ?? data.precio)
                    : Number(existing.dish_price),
            dishCategory:
                data.dishCategory ??
                data.categoria ??
                data.dish_category ??
                existing.dish_category,
            dishDescription:
                data.dishDescription ??
                data.descripcion ??
                data.dish_description ??
                existing.dish_description,
            dishImageUrl:
                data.dishImageUrl ??
                data.dish_image_url ??
                data.imagen ??
                existing.dish_image_url,
            isActive: data.isActive ?? data.is_active ?? existing.is_active,
        };

        return await dishRepository.update(id, dishData);
    },

    async createDish(data) {
        const dishData = {
            dishName: data.nombre || data.dishName,
            dishPrice: Number(data.precio || data.dishPrice),
            dishCategory: data.categoria || data.dishCategory,
            dishDescription: data.descripcion || data.dishDescription,
            dishImageUrl:
                data.dishImageUrl ?? data.dish_image_url ?? data.imagen ?? null,
            isActive: data.isActive ?? true,
        };

        return await dishRepository.create(dishData);
    },
};