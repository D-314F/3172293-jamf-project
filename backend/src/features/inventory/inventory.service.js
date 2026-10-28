import { inventoryRepository } from "./inventory.repository.js";

export const inventoryService = {
    async createInventory(data) {
        const inventoryData = {
            marca: data.marca,
            codigo: data.codigo,
            nombre: data.nombre,
            codigoBarras: data.codigoBarras,
            cuentadante: data.cuentadante,
            cantidad: Number(data.cantidad),
            cantidadTotal: Number(data.cantidadTotal),
            cantidadMinima: Number(data.cantidadMinima),
            valorUnitario: Number(data.valorUnitario),
            valorTotal: Number(data.valorTotal),
            lote: data.lote,
            ubicacion: data.ubicacion,
            fechaVencimiento: data.fechaVencimiento || null,
            descripcion: data.descripcion,
            comentarioProducto: data.comentarioProducto || null,
            productImageUrl: null,
            isActive: data.isActive ?? true,
        };

        return await inventoryRepository.create(inventoryData);
    },
};