import { pool } from "../../config/db.js";
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

function parseOrderItems(rawDishStr = "", fallbackQty = 1) {
    const entries = String(rawDishStr || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

    const counts = new Map();
    for (const entry of entries) {
        const match = entry.match(/^(\d+)x\s+(.+)$/i);
        const qty = match
            ? Number(match[1])
            : entries.length === 1
            ? Number(fallbackQty) || 1
            : 1;
        const name = (match ? match[2] : entry).trim();
        const key = name.toLowerCase();
        const existing = counts.get(key);
        counts.set(key, { name, qty: (existing?.qty || 0) + qty });
    }
    return counts;
}

function isOrderCancelled(statusText, isActive) {
    return (
        isActive === false ||
        String(statusText || "").trim().toLowerCase() === "cancelado"
    );
}

async function adjustStockForDeltas(client, oldMap, newMap) {
    const allKeys = new Set([...oldMap.keys(), ...newMap.keys()]);

    for (const key of allKeys) {
        const oldQty = oldMap.get(key)?.qty || 0;
        const newEntry = newMap.get(key);
        const newQty = newEntry?.qty || 0;
        const delta = newQty - oldQty;

        if (delta === 0) continue;

        const dishRes = await client.query(
            `SELECT d.id, d.dish_name, d.dish_stock, d.is_active, d.inventory_id,
                    i.nombre AS inv_name, i.cantidad AS inv_qty, i.is_active AS inv_active
             FROM public.dishes d
             LEFT JOIN public.inventory i ON d.inventory_id = i.id
             WHERE LOWER(TRIM(d.dish_name)) = $1
             FOR UPDATE OF d`,
            [key]
        );

        const dish = dishRes.rows[0];
        if (!dish) continue;

        if (delta > 0) {
            let available = Math.max(0, Number(dish.dish_stock ?? 0));
            if (!dish.is_active) available = 0;

            if (dish.inventory_id) {
                const invActive = dish.inv_active !== false;
                const invQty = Math.max(0, Number(dish.inv_qty ?? 0));
                available = invActive && invQty > 0 ? Math.min(available, invQty) : 0;
            }

            if (delta > available) {
                const err = new Error(
                    `Stock insuficiente para "${dish.dish_name}": solicitaste ${delta} unidad(es) adicionales y solo hay ${available} disponible(s).`
                );
                err.statusCode = 400;
                throw err;
            }

            await client.query(
                `UPDATE public.dishes
                 SET dish_stock = GREATEST(0, dish_stock - $1)
                 WHERE id = $2`,
                [delta, dish.id]
            );

            if (dish.inventory_id) {
                await client.query(
                    `UPDATE public.inventory
                     SET cantidad = GREATEST(0, cantidad - $1),
                         is_active = CASE WHEN cantidad - $1 <= 0 THEN FALSE ELSE is_active END,
                         status = CASE WHEN cantidad - $1 <= 0 THEN 'Agotado' ELSE status END
                     WHERE id = $2`,
                    [delta, dish.inventory_id]
                );
            }
        } else {
            // delta < 0: devolvemos al stock al quitar platos o cancelar orden
            const refund = Math.abs(delta);
            await client.query(
                `UPDATE public.dishes
                 SET dish_stock = dish_stock + $1
                 WHERE id = $2`,
                [refund, dish.id]
            );

            if (dish.inventory_id) {
                await client.query(
                    `UPDATE public.inventory
                     SET cantidad = cantidad + $1,
                         is_active = TRUE,
                         status = CASE WHEN status = 'Agotado' THEN 'Disponible' ELSE status END
                     WHERE id = $2`,
                    [refund, dish.inventory_id]
                );
            }
        }
    }
}

export const orderService = {
    async getAllOrders() {
        const orders = await orderRepository.findAll();
        return orders.map(mapOrderFromDb);
    },

    async getOrderById(id) {
        const order = await orderRepository.findById(id);
        if (!order) {
            const err = new Error("Orden no encontrada");
            err.statusCode = 404;
            throw err;
        }
        return mapOrderFromDb(order);
    },

    async updateOrder(id, data) {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            const existingRes = await client.query(
                "SELECT * FROM public.orders WHERE id = $1 FOR UPDATE",
                [Number(id)]
            );
            const existing = existingRes.rows[0];
            if (!existing) {
                const err = new Error("Orden no encontrada");
                err.statusCode = 404;
                throw err;
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

            const wasCancelled = isOrderCancelled(existing.order_status, existing.is_active);
            const willBeCancelled = isOrderCancelled(orderData.orderStatus, orderData.isActive);

            const oldMap = wasCancelled
                ? new Map()
                : parseOrderItems(existing.dish_id, existing.quantity);
            const newMap = willBeCancelled
                ? new Map()
                : parseOrderItems(orderData.dishId, orderData.quantity);

            await adjustStockForDeltas(client, oldMap, newMap);

            const updateRes = await client.query(
                `UPDATE public.orders SET
                    table_number = $1,
                    waiter_id = $2,
                    dish_id = $3,
                    quantity = $4,
                    order_status = $5,
                    observations = $6,
                    is_active = $7
                 WHERE id = $8
                 RETURNING id;`,
                [
                    orderData.tableNumber,
                    orderData.waiterId,
                    orderData.dishId,
                    orderData.quantity,
                    orderData.orderStatus,
                    orderData.observations,
                    orderData.isActive,
                    Number(id),
                ]
            );

            await client.query("COMMIT");
            return updateRes.rows[0];
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            client.release();
        }
    },

    async createOrder(data) {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            const orderData = {
                tableNumber: Number(data.tableNumber),
                waiterId: data.waiterId,
                dishId: data.dishId,
                quantity: Number(data.quantity) || 1,
                orderStatus: data.estado || "Pendiente",
                observations: data.observations || null,
                isActive: data.isActive ?? true,
            };

            const itemsMap = parseOrderItems(orderData.dishId, orderData.quantity);
            await adjustStockForDeltas(client, new Map(), itemsMap);

            const insertRes = await client.query(
                `INSERT INTO public.orders (
                    table_number,
                    waiter_id,
                    dish_id,
                    quantity,
                    order_status,
                    observations,
                    is_active
                ) VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING id;`,
                [
                    orderData.tableNumber,
                    orderData.waiterId,
                    orderData.dishId,
                    orderData.quantity,
                    orderData.orderStatus,
                    orderData.observations,
                    orderData.isActive,
                ]
            );

            await client.query("COMMIT");
            return insertRes.rows[0];
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            client.release();
        }
    },
};
