// Importamos el pool de conexión a PostgreSQL
import { pool } from "../../config/db.js";

export const dishRepository = {
    // Aqui inserta un platillo en la base de datos y devuelve su id
    async create(dishData) {
        const {
            dishName,
            dishPrice,
            dishCategory,
            dishDescription,
            dishImageUrl,
            isActive,
        } = dishData;

        const query = `
            INSERT INTO dishes (
                dish_name,
                dish_price,
                dish_category,
                dish_description,
                dish_image_url,
                is_active
            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id;
        `;

        const values = [
            dishName,
            dishPrice,
            dishCategory,
            dishDescription,
            dishImageUrl,
            isActive,
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
    },
};