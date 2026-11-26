import { tablesService } from "./tables.service.js";

export const tablesController = {
    async getAll(_req, res) {
        try {
            const data = await tablesService.getFloorsAndTables();
            res.status(200).json(data);
        } catch (error) {
            console.error("Error al obtener pisos y mesas:", error);
            res.status(500).json({
                error: error.message || "Error al obtener pisos y mesas",
            });
        }
    },

    async createFloor(req, res) {
        try {
            const floor = await tablesService.createFloor(req.body);
            res.status(201).json({
                message: "Piso creado exitosamente",
                floor,
            });
        } catch (error) {
            console.error("Error al crear piso:", error);
            res.status(error.statusCode || 500).json({
                error: error.message || "Error al crear el piso",
            });
        }
    },

    async createTable(req, res) {
        try {
            const table = await tablesService.createTable(req.body);
            res.status(201).json({
                message: "Mesa creada exitosamente",
                table,
            });
        } catch (error) {
            console.error("Error al crear mesa:", error);
            res.status(error.statusCode || 500).json({
                error: error.message || "Error al crear la mesa",
            });
        }
    },

    async updateLayout(req, res) {
        try {
            const tables = Array.isArray(req.body?.tables)
                ? req.body.tables
                : req.body;
            const updated = await tablesService.saveLayout(tables);
            res.status(200).json({
                message: "Distribución de mesas guardada correctamente",
                tables: updated,
            });
        } catch (error) {
            console.error("Error al guardar distribución de mesas:", error);
            res.status(error.statusCode || 500).json({
                error: error.message || "Error al guardar la distribución de mesas",
            });
        }
    },

    async deleteTable(req, res) {
        try {
            const { id } = req.params;
            const deleted = await tablesService.removeTable(id);
            res.status(200).json({
                message: "Mesa eliminada correctamente",
                deleted,
            });
        } catch (error) {
            console.error("Error al eliminar mesa:", error);
            res.status(error.statusCode || 500).json({
                error: error.message || "Error al eliminar la mesa",
            });
        }
    },
};
