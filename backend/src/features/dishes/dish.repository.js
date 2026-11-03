import { pool } from "../../config/db.js";

export const dishRepository = {
    // 1. Obtener todos los platillos para la tabla
    async findAll() {
        const query = "SELECT * FROM public.dishes ORDER BY id ASC";
        const result = await pool.query(query);
        return result.rows;
    },

    // 2. Obtener platillo por ID (para Ver y Editar)
    async findById(id) {
        const query = "SELECT * FROM public.dishes WHERE id = $1";
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    // 3. Crear platillo en la BD
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

    // 4. Actualizar platillo en la BD
    async update(id, dishData) {
        const {
            dishName,
            dishPrice,
            dishCategory,
            dishDescription,
            dishImageUrl,
            isActive,
        } = dishData;

        const query = `
            UPDATE dishes SET
                dish_name = $1,
                dish_price = $2,
                dish_category = $3,
                dish_description = $4,
                dish_image_url = $5,
                is_active = $6
            WHERE id = $7
            RETURNING id;
        `;

        const values = [
            dishName,
            dishPrice,
            dishCategory,
            dishDescription,
            dishImageUrl,
            isActive,
            id,
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
    },
};