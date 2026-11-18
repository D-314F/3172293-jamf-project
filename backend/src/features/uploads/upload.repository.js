import { pool } from "../../config/db.js";

export const uploadRepository = {
    async create({ folder, originalName, hashName, fileUrl, mimeType, sizeBytes }) {
        const query = `
            INSERT INTO public.media_files (
                folder,
                original_name,
                hash_name,
                file_url,
                mime_type,
                size_bytes
            ) VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (hash_name) DO UPDATE SET
                original_name = EXCLUDED.original_name
            RETURNING id, folder, original_name, hash_name, file_url, mime_type, size_bytes, created_at;
        `;
        const values = [folder, originalName, hashName, fileUrl, mimeType, Number(sizeBytes) || 0];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    async findAll() {
        const result = await pool.query(
            "SELECT id, folder, original_name, hash_name, file_url, mime_type, size_bytes, created_at FROM public.media_files ORDER BY id DESC"
        );
        return result.rows;
    },
};
