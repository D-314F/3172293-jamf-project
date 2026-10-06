import { pool } from "../../config/db.js";

export const authRepository = {
    // Busca un usuario por su correo para validar el login
    async findByEmail(userEmail) {
        const query = `
            SELECT id, user_name, user_email, user_password, is_active
            FROM users
            WHERE user_email = $1
            LIMIT 1;
        `;

        const result = await pool.query(query, [userEmail]);
        return result.rows[0];
    },
};