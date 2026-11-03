import { pool } from "../../config/db.js";

export const inventoryRepository = {
    // 1. Obtener todos los productos
    async findAll() {
        const query = "SELECT * FROM public.inventory ORDER BY id ASC";
        const result = await pool.query(query);
        return result.rows;
    },

    // 2. Obtener producto por ID
    async findById(id) {
        const query = "SELECT * FROM public.inventory WHERE id = $1";
        const result = await pool.query(query, [Number(id)]);
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
            status,
            isActive,
        } = inventoryData;

        const query = `
            INSERT INTO public.inventory (
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
                status,
                is_active
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18
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
            status || "Disponible",
            isActive ?? (status === "Disponible"),
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
    },

    // 4. Actualizar únicamente el estado del producto (4 opciones)
    async updateStatus(id, statusText) {
        const query = `
            UPDATE public.inventory 
            SET status = $1, is_active = ($1 = 'Disponible')
            WHERE id = $2 
            RETURNING id, status, is_active;
        `;
        const result = await pool.query(query, [statusText, Number(id)]);
        return result.rows[0] || { id: Number(id), status: statusText };
    },

    // 5. Actualizar producto completo
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
            status,
        } = inventoryData;

        const query = `
            UPDATE public.inventory SET
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
                status = $17,
                is_active = ($17 = 'Disponible')
            WHERE id = $18
            RETURNING id, status, is_active;
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
            status || "Disponible",
            Number(id),
        ];

        const result = await pool.query(query, values);
        return result.rows[0] || { id: Number(id), status: status || "Disponible" };
    },
};