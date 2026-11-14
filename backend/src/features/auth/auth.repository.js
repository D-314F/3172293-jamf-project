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

    // Obtiene el perfil completo del usuario autenticado
    async findProfileById(userId) {
        const query = `
            SELECT
                u.id,
                u.user_name,
                u.user_type,
                u.user_document_types,
                u.user_document_number,
                u.user_business_email,
                u.user_email,
                u.user_phone,
                u.user_address,
                u.user_start_date,
                u.user_avatar_url,
                u.is_active,
                u.is_staff,
                u.is_superuser,
                ARRAY_REMOVE(ARRAY_AGG(DISTINCT g_ug.group_name), NULL) AS user_groups_list,
                ARRAY_REMOVE(ARRAY_AGG(DISTINCT g_ut.group_name), NULL) AS role_groups_list
            FROM users u
            LEFT JOIN user_groups ug ON ug.user_id = u.id
            LEFT JOIN groups g_ug ON g_ug.group_id = ug.group_id
            LEFT JOIN groups g_ut ON LOWER(g_ut.group_name) = LOWER(u.user_type)
            WHERE u.id = $1
            GROUP BY u.id
            LIMIT 1;
        `;

        const result = await pool.query(query, [userId]);
        return result.rows[0];
    },

        // Actualiza únicamente los datos de contacto propios del usuario autenticado
    async updateOwnContact(userId, { userPhone, userAddress }) {
        const query = `
            UPDATE users
            SET user_phone = $1,
                user_address = $2
            WHERE id = $3
            RETURNING id;
        `;

        const result = await pool.query(query, [userPhone, userAddress, userId]);
        return result.rows[0];
    },
};