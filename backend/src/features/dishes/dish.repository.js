import { pool } from "../../config/db.js";

const DISH_WITH_INVENTORY_SELECT = `
    SELECT d.*,
           i.nombre AS inventory_name,
           i.codigo AS inventory_codigo,
           i.cantidad AS inventory_quantity,
           i.is_active AS inventory_is_active,
           i.status AS inventory_status
    FROM public.dishes d
    LEFT JOIN public.inventory i ON d.inventory_id = i.id
`;

export const dishRepository = {
    // 1. Obtener todos los platillos junto con el insumo y stock de inventario
    async findAll() {
        const query = `${DISH_WITH_INVENTORY_SELECT} ORDER BY d.id ASC`;
        const result = await pool.query(query);
        return result.rows;
    },

    // 2. Obtener platillo por ID (para Ver y Editar)
    async findById(id) {
        const query = `${DISH_WITH_INVENTORY_SELECT} WHERE d.id = $1`;
        const result = await pool.query(query, [Number(id)]);
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
            inventoryId,
            dishStock,
            isActive,
        } = dishData;

        const query = `
            INSERT INTO public.dishes (
                dish_name,
                dish_price,
                dish_category,
                dish_description,
                dish_image_url,
                inventory_id,
                dish_stock,
                is_active
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id;
        `;

        const values = [
            dishName,
            dishPrice,
            dishCategory,
            dishDescription,
            dishImageUrl,
            inventoryId ? Number(inventoryId) : null,
            Number(dishStock ?? 0),
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
            inventoryId,
            dishStock,
            isActive,
        } = dishData;

        const query = `
            UPDATE public.dishes SET
                dish_name = $1,
                dish_price = $2,
                dish_category = $3,
                dish_description = $4,
                dish_image_url = $5,
                inventory_id = $6,
                dish_stock = $7,
                is_active = $8
            WHERE id = $9
            RETURNING id;
        `;

        const values = [
            dishName,
            dishPrice,
            dishCategory,
            dishDescription,
            dishImageUrl,
            inventoryId ? Number(inventoryId) : null,
            Number(dishStock ?? 0),
            isActive,
            Number(id),
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
    },
};
