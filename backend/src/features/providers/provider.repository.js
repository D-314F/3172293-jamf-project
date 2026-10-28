// Importamos el pool de conexión a PostgreSQL
import { pool } from "../../config/db.js";

export const providerRepository = {
    // Inserta un proveedor en la base de datos y devuelve su id
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
};