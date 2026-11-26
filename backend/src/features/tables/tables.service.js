import { tablesRepository } from "./tables.repository.js";

function mapTable(row) {
    return {
        id: row.id,
        tableNumber: Number(row.table_number),
        tableCode: row.table_code,
        displayName: row.display_name,
        floorId: Number(row.floor_id),
        floorNumber: row.floor_number ? Number(row.floor_number) : undefined,
        floorName: row.floor_name,
        prefix: row.prefix,
        capacity: Number(row.capacity) || 4,
        shape: row.shape || "square",
        posX: Number(row.pos_x),
        posY: Number(row.pos_y),
        isActive: row.is_active !== false,
    };
}

function mapFloor(row) {
    return {
        id: Number(row.id),
        floorNumber: Number(row.floor_number),
        floorName: row.floor_name,
        prefix: row.prefix,
        isActive: row.is_active !== false,
    };
}

export const tablesService = {
    async getFloorsAndTables() {
        const [floors, tables] = await Promise.all([
            tablesRepository.findAllFloors(),
            tablesRepository.findAllTables(),
        ]);

        return {
            floors: floors.map(mapFloor),
            tables: tables.map(mapTable),
        };
    },

    async createFloor(data = {}) {
        const floor = await tablesRepository.createFloor({
            floorName: data.floorName || data.name,
            prefix: data.prefix,
        });
        return mapFloor(floor);
    },

    async createTable(data = {}) {
        if (!data.floorId) {
            const err = new Error("Debes especificar el piso (floorId) para crear la mesa.");
            err.statusCode = 400;
            throw err;
        }
        const table = await tablesRepository.createTable(data);
        return mapTable(table);
    },

    async saveLayout(tables = []) {
        if (!Array.isArray(tables)) {
            const err = new Error("El formato de distribución de mesas no es válido.");
            err.statusCode = 400;
            throw err;
        }
        const updated = await tablesRepository.updateLayoutBatch(tables);
        return updated.map(mapTable);
    },

    async removeTable(id) {
        const deleted = await tablesRepository.deleteTable(id);
        if (!deleted) {
            const err = new Error("La mesa indicada no existe.");
            err.statusCode = 404;
            throw err;
        }
        return deleted;
    },
};
