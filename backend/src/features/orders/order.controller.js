import { orderService } from "./order.service.js";

export const orderController = {
    async create(req, res) {
        try {
            const order = await orderService.createOrder(req.body);

            res.status(201).json({
                message: "Orden creada correctamente",
                orderId: order.id,
            });
        } catch (err) {
            console.error("ERROR BACKEND (ORDERS):", err.message);
            res.status(500).json({ error: "Error interno del servidor al crear la orden" });
        }
    },
};