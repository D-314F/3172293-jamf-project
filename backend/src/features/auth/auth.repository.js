import { pool } from "../../config/db.js";

export const authRepository = {
    // Busca usuario por correo (ignora mayúsculas/minúsculas)
    async findByEmail(userEmail) {
        const query = `
            SELECT id, user_name, user_email, user_password, is_active, failed_attempts, is_locked, locked_until
            FROM users
            WHERE LOWER(user_email) = LOWER($1)
            LIMIT 1;
        `;

        const result = await pool.query(query, [userEmail]);
        return result.rows[0];
    },

    // Incrementa intentos; al tercer intento bloquea y calcula 10 minutos
    async incrementFailedAttempts(userId, lockMinutes = 10) {
        const query = `
            UPDATE users
            SET failed_attempts = COALESCE(failed_attempts, 0) + 1,
                is_locked = CASE WHEN COALESCE(failed_attempts, 0) + 1 >= 3 THEN TRUE ELSE FALSE END,
                locked_until = CASE 
                    WHEN COALESCE(failed_attempts, 0) + 1 >= 3 
                    THEN NOW() + ($2 || ' minutes')::INTERVAL 
                    ELSE NULL 
                END
            WHERE id = $1
            RETURNING failed_attempts, is_locked, locked_until;
        `;

        const result = await pool.query(query, [userId, lockMinutes]);
        return result.rows[0];
    },

    // Reinicia intentos y limpia el bloqueo
    async resetFailedAttempts(userId) {
        const query = `
            UPDATE users
            SET failed_attempts = 0,
                is_locked = FALSE,
                locked_until = NULL
            WHERE id = $1;
        `;

        await pool.query(query, [userId]);
    },
};