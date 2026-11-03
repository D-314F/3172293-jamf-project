// Importamos el pool de conexión a PostgreSQL
import { pool } from "../../config/db.js";

export const userRepository = {
    // Aqui obetenemos todos los usuarios para la tabla
    async findAll() {
        const query = "SELECT * FROM public.users ORDER BY id ASC";
        const result = await pool.query(query);
        return result.rows;
    },

    // Y Aqui buscamos el usuario por ID (para Ver Detalle y Editar)
    async findById(id) {
        const query = "SELECT * FROM public.users WHERE id = $1";
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    // 3. Crear usuario en la BD
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

    // Aqui es para actualizar usuario en la BD (para Editar y para el Switch de Estado)
    async update(id, userData) {
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
            userAvatarUrl,
            isActive,
            isStaff,
            isSuperuser,
        } = userData;

        const query = `
            UPDATE users SET
                user_name = $1,
                user_type = $2,
                user_document_types = $3,
                user_document_number = $4,
                user_business_email = $5,
                user_email = $6,
                user_phone = $7,
                user_address = $8,
                user_start_date = $9,
                user_end_date = $10,
                user_avatar_url = $11,
                is_active = $12,
                is_staff = $13,
                is_superuser = $14
            WHERE id = $15
            RETURNING id;
        `;

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
            userAvatarUrl,
            isActive,
            isStaff,
            isSuperuser,
            id,
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
    },
};