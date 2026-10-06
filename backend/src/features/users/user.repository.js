// Importamos el pool de conexión a PostgreSQL
import { pool } from "../../config/db.js";

export const userRepository = {
    // Inserta un usuario en la base de datos y devuelve su id
    async create(userData) {
        const {
            userName,
            userType,
            userDocumentTypes,
            userDocumentNumber,
            userBusinessEmail,
            userEmail,
            userPhone,
            userAddress,
            userStartDate,
            userEndDate,
            userPassword,
            userAvatarUrl,
            isStaff,
            isActive,
            isSuperuser,
        } = userData;

        // Los placeholders ($1, $2...) previenen inyección SQL
        const query = `
            INSERT INTO users (
                user_name,
                user_type,
                user_document_types,
                user_document_number,
                user_business_email,
                user_email,
                user_phone,
                user_address,
                user_start_date,
                user_end_date,
                user_password,
                user_avatar_url,
                is_staff,
                is_active,
                is_superuser
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
            RETURNING id;
        `;

        // El orden debe coincidir EXACTAMENTE con los placeholders
        const values = [
            userName,
            userType,
            userDocumentTypes,
            userDocumentNumber,
            userBusinessEmail,
            userEmail,
            userPhone,
            userAddress,
            userStartDate,
            userEndDate,
            userPassword,
            userAvatarUrl,
            isStaff,
            isActive,
            isSuperuser,
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
    },
};