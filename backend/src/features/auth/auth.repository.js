import { pool } from "../../config/db.js";

export const authRepository = {
  
    async findByEmail(userEmail) {
        const query = `
            SELECT id, user_name, user_email, user_password, is_active, failed_attempts, is_locked
            FROM users
            WHERE user_email = $1
            LIMIT 1;
        `;

        const result = await pool.query(query, [userEmail]);
        return result.rows[0];
    },

    async incrementFailedAttempts(userId) {
        const query = `
            UPDATE users
            SET failed_attempts = COALESCE(failed_attempts, 0) + 1,
                is_locked = CASE WHEN COALESCE(failed_attempts, 0) + 1 >= 3 THEN TRUE ELSE is_locked END
            WHERE id = $1
            RETURNING failed_attempts, is_locked;
        `;

        const result = await pool.query(query, [userId]);
        return result.rows[0];
    },

    async resetFailedAttempts(userId) {
        const query = `
            UPDATE users
            SET failed_attempts = 0,
                is_locked = FALSE
            WHERE id = $1;
        `;

        await pool.query(query, [userId]);
    },
};