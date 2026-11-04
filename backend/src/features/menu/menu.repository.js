import { pool } from "../../config/db.js";

export const menuRepository = {
    // 1. Obtener todos los platillos del menú
    async findAll() {
        const query = "SELECT id, title, description, price, category, image_url, is_active FROM public.dishes ORDER BY id ASC";
        const result = await pool.query(query);
        return result.rows;
    },

    // 2. Obtener platillo por ID (por si se requiere consultar el detalle)
    async findById(id) {
        const query = "SELECT id, title, description, price, category, image_url, is_active FROM public.dishes WHERE id = $1";
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    // 3. Actualizar el estado (activo/inactivo) del platillo desde la vista de menú
    async updateStatus(id, isActive) {
        const query = `
            UPDATE public.dishes 
            SET is_active = $1 
            WHERE id = $2 
            RETURNING id, title, is_active;
        `;
        const result = await pool.query(query, [isActive, id]);
        return result.rows[0];
    }
};