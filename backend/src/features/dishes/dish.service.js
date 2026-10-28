import { dishRepository } from "./dish.repository.js";

export const dishService = {
    async createDish(data) {
        const dishData = {
            dishName: data.nombre,
            dishPrice: Number(data.precio),
            dishCategory: data.categoria,
            dishDescription: data.descripcion,
            // Aqui abajo la imagen aun no se guarda en servidor, igual que en users
            dishImageUrl: null,
            isActive: data.isActive ?? true,
        };

        return await dishRepository.create(dishData);
    },
};