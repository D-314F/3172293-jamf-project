import { pool } from "../../config/db.js";

export const userRepository = {
    async findAll() {
        const query = "SELECT * FROM public.users ORDER BY id ASC";
        const result = await pool.query(query);
        return result.rows;
    },

    async findById(id) {
        const query = "SELECT * FROM public.users WHERE id = $1";
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    async create(userData) {
        const {
            userName,
            userType,
            userDocumentTypes,
            userDocumentNumber,
            userBusinessEmail,
            userEmail,
            userPhone,
            userSecondaryPhone,
            userGroup,
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
                user_secondary_phone,
                user_group,
                user_address,
                user_start_date,
                user_end_date,
                user_password,
                user_avatar_url,
                is_staff,
                is_active,
                is_superuser
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
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
            userSecondaryPhone || null,
            userGroup || null,
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

    async update(id, userData) {
        const {
            userName,
            userType,
            userDocumentTypes,
            userDocumentNumber,
            userBusinessEmail,
            userEmail,
            userPhone,
            userSecondaryPhone,
            userGroup,
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
                user_secondary_phone = $8,
                user_group = $9,
                user_address = $10,
                user_start_date = $11,
                user_end_date = $12,
                user_avatar_url = $13,
                is_active = $14,
                is_staff = $15,
                is_superuser = $16
            WHERE id = $17
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
            userSecondaryPhone || null,
            userGroup || null,
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