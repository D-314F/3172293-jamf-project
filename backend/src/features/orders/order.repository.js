import { pool } from "../../config/db.js";

export const orderRepository = {
    // 1. Obtener todas las órdenes
    async findAll() {
        const query = "SELECT * FROM public.orders ORDER BY id ASC";
        const result = await pool.query(query);
        return result.rows;
    },

    // 2. Obtener orden por ID (Ver detalle y Editar)
    async findById(id) {
        const query = "SELECT * FROM public.orders WHERE id = $1";
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    // 3. Crear orden en la BD
    async create(orderData) {
        const {
            tableNumber,
            waiterId,
            dishId,
            quantity,
            orderStatus,
            observations,
            isActive,
        } = orderData;

        const query = `
            INSERT INTO orders (
                table_number,
                waiter_id,
                dish_id,
                quantity,
                order_status,
                observations,
                is_active
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id;
        `;

        const values = [
            tableNumber,
            waiterId,
            dishId,
            quantity,
            orderStatus,
            observations,
            isActive,
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
    },

    // 4. Actualizar orden en la BD
    async update(id, orderData) {
        const {
            tableNumber,
            waiterId,
            dishId,
            quantity,
            orderStatus,
            observations,
            isActive,
        } = orderData;

        const query = `
            UPDATE orders SET
                table_number = $1,
                waiter_id = $2,
                dish_id = $3,
                quantity = $4,
                order_status = $5,
                observations = $6,
                is_active = $7
            WHERE id = $8
            RETURNING id;
        `;

        const values = [
            tableNumber,
            waiterId,
            dishId,
            quantity,
            orderStatus,
            observations,
            isActive,
            id,
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
    },
};