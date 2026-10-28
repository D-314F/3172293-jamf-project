// Importamos el pool de conexión a PostgreSQL
import { pool } from "../../config/db.js";

export const inventoryRepository = {
    // Inserta un producto de inventario en la base de datos y devuelve su id
    async create(inventoryData) {
        const {
            marca,
            codigo,
            nombre,
            codigoBarras,
            cuentadante,
            cantidad,
            cantidadTotal,
            cantidadMinima,
            valorUnitario,
            valorTotal,
            lote,
            ubicacion,
            fechaVencimiento,
            descripcion,
            comentarioProducto,
            productImageUrl,
            isActive,
        } = inventoryData;

        const query = `
            INSERT INTO inventory (
                marca,
                codigo,
                nombre,
                codigo_barras,
                cuentadante,
                cantidad,
                cantidad_total,
                cantidad_minima,
                valor_unitario,
                valor_total,
                lote,
                ubicacion,
                fecha_vencimiento,
                descripcion,
                comentario_producto,
                product_image_url,
                is_active
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
            )
            RETURNING id;
        `;

        const values = [
            marca,
            codigo,
            nombre,
            codigoBarras,
            cuentadante,
            cantidad,
            cantidadTotal,
            cantidadMinima,
            valorUnitario,
            valorTotal,
            lote,
            ubicacion,
            fechaVencimiento,
            descripcion,
            comentarioProducto,
            productImageUrl,
            isActive,
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
    },
};