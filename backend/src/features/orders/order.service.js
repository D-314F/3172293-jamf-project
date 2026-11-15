import { orderRepository } from "./order.repository.js";

function mapOrderFromDb(order) {
    const rawDish = String(order.dish_id || "").trim();
    const isMultiOrFormatted =
        /^\d+x\s/i.test(rawDish) || rawDish.includes(",");

    return {
        id: order.id,
        mesa: order.table_number,
        tableNumber: String(order.table_number),
        mesero: order.waiter_id,
        waiterId: order.waiter_id,
        dishId: rawDish,
        quantity: order.quantity,
        detalles: isMultiOrFormatted
            ? rawDish
            : `${order.quantity}x ${rawDish}`,
        fecha: order.created_at,
        estado: order.order_status || "Pendiente",
        orderStatus: order.order_status || "Pendiente",
        observations: order.observations || "",
        isActive: order.is_active,
    };
}

export const orderService = {
    async getAllOrders() {
        const orders = await orderRepository.findAll();
        return orders.map(mapOrderFromDb);
    },

    async getOrderById(id) {
        const order = await orderRepository.findById(id);
        if (!order) {
            throw new Error("Orden no encontrada");
        }
        return mapOrderFromDb(order);
    },

    async updateOrder(id, data) {
        const existing = await orderRepository.findById(id);
        if (!existing) {
            throw new Error("Orden no encontrada");
        }

        const orderData = {
            tableNumber:
                data.tableNumber !== undefined || data.mesa !== undefined
                    ? Number(data.tableNumber ?? data.mesa)
                    : Number(existing.table_number),
            waiterId:
                data.waiterId ?? data.mesero ?? data.waiter_id ?? existing.waiter_id,
            dishId: data.dishId ?? data.dish_id ?? existing.dish_id,
            quantity:
                data.quantity !== undefined
                    ? Number(data.quantity)
                    : Number(existing.quantity),
            orderStatus:
                data.estado ??
                data.orderStatus ??
                data.order_status ??
                existing.order_status,
            observations:
                data.observations !== undefined
                    ? data.observations
                    : existing.observations,
            isActive: data.isActive ?? data.is_active ?? existing.is_active,
        };

        return await orderRepository.update(id, orderData);
    },

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