import { inventoryRepository } from "./inventory.repository.js";

function formatDate(dateValue) {
    if (!dateValue) return "";
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return String(dateValue);
    return date.toISOString().split("T")[0];
}

function mapInventoryFromDb(item) {
    // Si la BD tiene status lo usa, si no, usa el fallback
    const status = item.status || (item.is_active ? "Disponible" : "Agotado");

    return {
        id: item.id,
        codigo: item.codigo,
        name: item.nombre,
        nombre: item.nombre,
        barcode: item.codigo_barras,
        codigoBarras: item.codigo_barras,
        brand: item.marca,
        marca: item.marca,
        cuentadante: item.cuentadante,
        quantity: item.cantidad,
        cantidad: item.cantidad,
        cantidadTotal: item.cantidad_total,
        cantidadMinima: item.cantidad_minima,
        unitPrice: Number(item.valor_unitario),
        valorUnitario: Number(item.valor_unitario),
        valorTotal: Number(item.valor_total),
        lote: item.lote,
        ubicacion: item.ubicacion,
        fechaVencimiento: formatDate(item.fecha_vencimiento),
        descripcion: item.descripcion,
        comentarioProducto: item.comentario_producto || "",
        productImageUrl: item.product_image_url || null,
        status: status,
        isActive: status === "Disponible",
    };
}

export const inventoryService = {
    async getAllInventory() {
        const items = await inventoryRepository.findAll();
        return items.map(mapInventoryFromDb);
    },

    async getInventoryById(id) {
        const item = await inventoryRepository.findById(id);
        if (!item) {
            throw new Error("Producto no encontrado en inventario");
        }
        return mapInventoryFromDb(item);
    },

    async updateInventory(id, data) {
        const existing = await inventoryRepository.findById(id);
        if (!existing) {
            throw new Error("Producto no encontrado en inventario");
        }

        // Si solo se está actualizando el estado (ej. desde el Select de la tabla)
        const hasOnlyStatus = Object.keys(data).every((k) =>
            ["status", "isActive"].includes(k)
        );

        if (hasOnlyStatus && data.status !== undefined) {
            return await inventoryRepository.updateStatus(id, data.status);
        }

        const cantidad =
            data.quantity !== undefined || data.cantidad !== undefined
                ? Number(data.quantity ?? data.cantidad)
                : Number(existing.cantidad);

        const valorUnitario =
            data.unitPrice !== undefined || data.valorUnitario !== undefined
                ? Number(data.unitPrice ?? data.valorUnitario)
                : Number(existing.valor_unitario);

        const fechaVenc = data.fechaVencimiento !== undefined
            ? (data.fechaVencimiento || null)
            : existing.fecha_vencimiento
            ? formatDate(existing.fecha_vencimiento)
            : null;

        const statusText = data.status || existing.status || "Disponible";

        const inventoryData = {
            marca: data.brand ?? data.marca ?? existing.marca,
            codigo: data.codigo ?? existing.codigo,
            nombre: data.name ?? data.nombre ?? existing.nombre,
            codigoBarras:
                data.barcode ?? data.codigoBarras ?? existing.codigo_barras,
            cuentadante: data.cuentadante ?? existing.cuentadante,
            cantidad: cantidad,
            cantidadTotal:
                data.cantidadTotal !== undefined
                    ? Number(data.cantidadTotal)
                    : existing.cantidad_total,
            cantidadMinima:
                data.cantidadMinima !== undefined
                    ? Number(data.cantidadMinima)
                    : existing.cantidad_minima,
            valorUnitario: valorUnitario,
            valorTotal:
                data.valorTotal !== undefined
                    ? Number(data.valorTotal)
                    : cantidad * valorUnitario,
            lote: data.lote ?? existing.lote,
            ubicacion: data.ubicacion ?? existing.ubicacion,
            fechaVencimiento: fechaVenc,
            descripcion: data.descripcion ?? existing.descripcion,
            comentarioProducto:
                data.comentarioProducto !== undefined
                    ? data.comentarioProducto
                    : existing.comentario_producto,
            productImageUrl:
                data.productImageUrl ?? existing.product_image_url,
            status: statusText,
        };

        return await inventoryRepository.update(id, inventoryData);
    },

    async createInventory(data) {
        const cantidad = Number(data.cantidad);
        const valorUnitario = Number(data.valorUnitario);
        const statusText = data.status || "Disponible";

        const inventoryData = {
            marca: data.marca,
            codigo: data.codigo,
            nombre: data.nombre,
            codigoBarras: data.codigoBarras,
            cuentadante: data.cuentadante,
            cantidad: cantidad,
            cantidadTotal: Number(data.cantidadTotal) || cantidad,
            cantidadMinima: Number(data.cantidadMinima) || 1,
            valorUnitario: valorUnitario,
            valorTotal: Number(data.valorTotal) || cantidad * valorUnitario,
            lote: data.lote,
            ubicacion: data.ubicacion,
            fechaVencimiento: data.fechaVencimiento || null,
            descripcion: data.descripcion,
            comentarioProducto: data.comentarioProducto || null,
            productImageUrl: null,
            status: statusText,
            isActive: statusText === "Disponible",
        };

        return await inventoryRepository.create(inventoryData);
    },
};