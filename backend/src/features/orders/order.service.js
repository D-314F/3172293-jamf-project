import { orderRepository } from "./order.repository.js";

export const orderService = {
    async createOrder(data) {
        const orderData = {
            tableNumber: Number(data.tableNumber),
            waiterId: data.waiterId,
            dishId: data.dishId,
            quantity: Number(data.quantity) || 1,
            orderStatus: data.estado || "Pendiente",
            observations: data.observations || null,
            isActive: data.isActive ?? true,
        };

        return await orderRepository.create(orderData);
    },
};