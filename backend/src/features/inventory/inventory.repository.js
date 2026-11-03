import { pool } from "../../config/db.js";

export const inventoryRepository = {
    // 1. Obtener todos los productos de inventario
    async findAll() {
        const query = "SELECT * FROM public.inventory ORDER BY id ASC";
        const result = await pool.query(query);
        return result.rows;
    },

    // 2. Obtener producto por ID
    async findById(id) {
        const query = "SELECT * FROM public.inventory WHERE id = $1";
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    // 3. Crear producto en la BD
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

    // 4. Actualización rápida de solo estado
    async updateStatus(id, isActive) {
        const query = `
            UPDATE inventory SET is_active = $1 WHERE id = $2 RETURNING id;
        `;
        const result = await pool.query(query, [isActive, id]);
        return result.rows[0];
    },

    // 5. Actualizar producto completo en la BD
    async update(id, inventoryData) {
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
            UPDATE inventory SET
                marca = $1,
                codigo = $2,
                nombre = $3,
                codigo_barras = $4,
                cuentadante = $5,
                cantidad = $6,
                cantidad_total = $7,
                cantidad_minima = $8,
                valor_unitario = $9,
                valor_total = $10,
                lote = $11,
                ubicacion = $12,
                fecha_vencimiento = $13,
                descripcion = $14,
                comentario_producto = $15,
                product_image_url = $16,
                is_active = $17
            WHERE id = $18
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
            id,
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
    },
};