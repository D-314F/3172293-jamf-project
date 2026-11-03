import { pool } from "../../config/db.js";

export const providerRepository = {
    // 1. Obtener todos los proveedores
    async findAll() {
        const query = "SELECT * FROM public.providers ORDER BY id ASC";
        const result = await pool.query(query);
        return result.rows;
    },

    // 2. Obtener proveedor por ID
    async findById(id) {
        const query = "SELECT * FROM public.providers WHERE id = $1";
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    // 3. Crear proveedor en la BD
    async create(providerData) {
        const {
            providerDocumentType,
            providerDocumentNumber,
            providerName,
            providerObservations,
            providerProducts,
            providerPhone,
            providerEmail,
            providerAddress,
            providerImageUrl,
            providerStatus,
        } = providerData;

        const query = `
            INSERT INTO providers (
                provider_document_type,
                provider_document_number,
                provider_name,
                provider_observations,
                provider_products,
                provider_phone,
                provider_email,
                provider_address,
                provider_image_url,
                provider_status
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING id;
        `;

        const values = [
            providerDocumentType,
            providerDocumentNumber,
            providerName,
            providerObservations,
            providerProducts,
            providerPhone,
            providerEmail,
            providerAddress,
            providerImageUrl,
            providerStatus,
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
    },

    // 4. Actualizar proveedor en la BD
    async update(id, providerData) {
        const {
            providerDocumentType,
            providerDocumentNumber,
            providerName,
            providerObservations,
            providerProducts,
            providerPhone,
            providerEmail,
            providerAddress,
            providerImageUrl,
            providerStatus,
        } = providerData;

        const query = `
            UPDATE providers SET
                provider_document_type = $1,
                provider_document_number = $2,
                provider_name = $3,
                provider_observations = $4,
                provider_products = $5,
                provider_phone = $6,
                provider_email = $7,
                provider_address = $8,
                provider_image_url = $9,
                provider_status = $10
            WHERE id = $11
            RETURNING id;
        `;

        const values = [
            providerDocumentType,
            providerDocumentNumber,
            providerName,
            providerObservations,
            providerProducts,
            providerPhone,
            providerEmail,
            providerAddress,
            providerImageUrl,
            providerStatus,
            id,
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
    },
};