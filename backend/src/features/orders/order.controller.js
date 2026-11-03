import { orderService } from "./order.service.js";

export const orderController = {
    async getAll(req, res) {
        try {
            const orders = await orderService.getAllOrders();
            return res.status(200).json(orders);
        } catch (err) {
            console.error("ERROR AL LISTAR ÓRDENES:", err.message);
            return res.status(500).json({ error: err.message });
        }
    },

    async getById(req, res) {
        try {
            const { id } = req.params;
            const order = await orderService.getOrderById(id);
            return res.status(200).json(order);
        } catch (err) {
            console.error("ERROR AL OBTENER ORDEN:", err.message);
            return res.status(404).json({ error: err.message });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const updatedOrder = await orderService.updateOrder(id, req.body);
            return res.status(200).json({
                message: "Orden actualizada correctamente",
                orderId: updatedOrder.id,
            });
        } catch (err) {
            console.error("ERROR AL ACTUALIZAR ORDEN:", err.message);
            return res.status(500).json({ error: err.message });
        }
    },

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