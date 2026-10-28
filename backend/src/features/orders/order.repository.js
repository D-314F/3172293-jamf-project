// Importamos el pool de conexión a PostgreSQL
import { pool } from "../../config/db.js";

export const orderRepository = {
    // Inserta una orden en la base de datos y devuelve su id
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
};