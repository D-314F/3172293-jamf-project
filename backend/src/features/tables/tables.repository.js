import { pool } from "../../config/db.js";

let schemaPromise = null;

export const tablesRepository = {
    async ensureSchema() {
        if (schemaPromise) return schemaPromise;

        schemaPromise = (async () => {
            await pool.query(`
                CREATE TABLE IF NOT EXISTS public.restaurant_floors (
                    id SERIAL PRIMARY KEY,
                    floor_number INTEGER NOT NULL UNIQUE,
                    floor_name VARCHAR(60) NOT NULL,
                    prefix VARCHAR(8) NOT NULL DEFAULT 'A',
                    is_active BOOLEAN NOT NULL DEFAULT TRUE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );

                CREATE TABLE IF NOT EXISTS public.restaurant_tables (
                    id SERIAL PRIMARY KEY,
                    table_number INTEGER NOT NULL UNIQUE,
                    table_code VARCHAR(20) NOT NULL,
                    display_name VARCHAR(60) NOT NULL,
                    floor_id INTEGER NOT NULL REFERENCES public.restaurant_floors(id) ON DELETE CASCADE,
                    capacity INTEGER NOT NULL DEFAULT 4,
                    shape VARCHAR(20) NOT NULL DEFAULT 'square',
                    pos_x NUMERIC(5,2) NOT NULL DEFAULT 15.00,
                    pos_y NUMERIC(5,2) NOT NULL DEFAULT 20.00,
                    is_active BOOLEAN NOT NULL DEFAULT TRUE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `);

            const countRes = await pool.query(
                "SELECT COUNT(*)::int AS total FROM public.restaurant_floors"
            );

            if ((countRes.rows[0]?.total || 0) === 0) {
                await pool.query(`
                    INSERT INTO public.restaurant_floors (floor_number, floor_name, prefix)
                    VALUES
                        (1, 'Piso 1 - Salón Principal', 'A'),
                        (2, 'Piso 2 - Terraza Lounge', 'B')
                    ON CONFLICT (floor_number) DO NOTHING;

                    INSERT INTO public.restaurant_tables (table_number, table_code, display_name, floor_id, capacity, shape, pos_x, pos_y)
                    SELECT t.table_number, t.table_code, t.display_name, f.id, t.capacity, t.shape, t.pos_x, t.pos_y
                    FROM (
                        VALUES
                            (1,  'A1', 'A1', 1, 4, 'square', 14.00, 24.00),
                            (2,  'A2', 'A2', 1, 4, 'square', 38.00, 24.00),
                            (3,  'A3', 'A3', 1, 6, 'rect',   62.00, 24.00),
                            (4,  'A4', 'A4', 1, 2, 'round',  86.00, 24.00),
                            (5,  'A5', 'A5', 1, 4, 'square', 14.00, 72.00),
                            (6,  'A6', 'A6', 1, 4, 'square', 38.00, 72.00),
                            (7,  'A7', 'A7', 1, 6, 'rect',   62.00, 72.00),
                            (8,  'A8', 'A8', 1, 4, 'round',  86.00, 72.00),
                            (9,  'B1', 'B1', 2, 4, 'square', 18.00, 32.00),
                            (10, 'B2', 'B2', 2, 4, 'square', 44.00, 32.00),
                            (11, 'B3', 'B3', 2, 6, 'rect',   72.00, 32.00),
                            (12, 'B4', 'B4', 2, 2, 'round',  44.00, 74.00)
                    ) AS t(table_number, table_code, display_name, floor_num, capacity, shape, pos_x, pos_y)
                    JOIN public.restaurant_floors f ON f.floor_number = t.floor_num
                    ON CONFLICT (table_number) DO NOTHING;
                `);
            }
        })();

        try {
            await schemaPromise;
        } catch (err) {
            schemaPromise = null;
            throw err;
        }
    },

    async findAllFloors() {
        await this.ensureSchema();
        const res = await pool.query(
            `SELECT id, floor_number, floor_name, prefix, is_active
             FROM public.restaurant_floors
             WHERE is_active = TRUE
             ORDER BY floor_number ASC`
        );
        return res.rows;
    },

    async findAllTables() {
        await this.ensureSchema();
        const res = await pool.query(
            `SELECT t.id,
                    t.table_number,
                    t.table_code,
                    t.display_name,
                    t.floor_id,
                    f.floor_number,
                    f.floor_name,
                    f.prefix,
                    t.capacity,
                    t.shape,
                    t.pos_x,
                    t.pos_y,
                    t.is_active
             FROM public.restaurant_tables t
             JOIN public.restaurant_floors f ON f.id = t.floor_id
             WHERE t.is_active = TRUE AND f.is_active = TRUE
             ORDER BY f.floor_number ASC, t.table_number ASC`
        );
        return res.rows;
    },

    async createFloor({ floorName, prefix }) {
        await this.ensureSchema();
        const maxRes = await pool.query(
            "SELECT COALESCE(MAX(floor_number), 0)::int AS max_floor FROM public.restaurant_floors"
        );
        const nextFloorNum = (maxRes.rows[0]?.max_floor || 0) + 1;
        const defaultPrefix =
            prefix ||
            String.fromCharCode(64 + Math.min(26, Math.max(1, nextFloorNum)));
        const finalName =
            String(floorName || "").trim() || `Piso ${nextFloorNum}`;

        const res = await pool.query(
            `INSERT INTO public.restaurant_floors (floor_number, floor_name, prefix, is_active)
             VALUES ($1, $2, $3, TRUE)
             RETURNING id, floor_number, floor_name, prefix, is_active`,
            [nextFloorNum, finalName, defaultPrefix.toUpperCase().slice(0, 4)]
        );
        return res.rows[0];
    },

    async createTable({
        floorId,
        tableCode,
        displayName,
        capacity = 4,
        shape = "square",
        posX = 50,
        posY = 50,
    }) {
        await this.ensureSchema();

        const maxNumRes = await pool.query(
            "SELECT COALESCE(MAX(table_number), 0)::int AS max_num FROM public.restaurant_tables"
        );
        const nextTableNumber = (maxNumRes.rows[0]?.max_num || 0) + 1;

        const floorRes = await pool.query(
            "SELECT id, floor_number, prefix FROM public.restaurant_floors WHERE id = $1",
            [Number(floorId)]
        );
        const floor = floorRes.rows[0];
        if (!floor) {
            const err = new Error("El piso seleccionado no existe.");
            err.statusCode = 404;
            throw err;
        }

        const countInFloorRes = await pool.query(
            "SELECT COUNT(*)::int AS count_in_floor FROM public.restaurant_tables WHERE floor_id = $1 AND is_active = TRUE",
            [floor.id]
        );
        const seqInFloor = (countInFloorRes.rows[0]?.count_in_floor || 0) + 1;
        const autoCode = `${floor.prefix || "A"}${seqInFloor}`;

        const cleanCode = String(tableCode || autoCode)
            .trim()
            .toUpperCase()
            .slice(0, 20);
        const cleanName = String(displayName || cleanCode)
            .trim()
            .slice(0, 60);

        const res = await pool.query(
            `INSERT INTO public.restaurant_tables (
                table_number,
                table_code,
                display_name,
                floor_id,
                capacity,
                shape,
                pos_x,
                pos_y,
                is_active
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, TRUE)
            RETURNING id, table_number, table_code, display_name, floor_id, capacity, shape, pos_x, pos_y, is_active`,
            [
                nextTableNumber,
                cleanCode,
                cleanName,
                floor.id,
                Math.max(1, Math.min(20, Number(capacity) || 4)),
                ["square", "round", "rect"].includes(shape) ? shape : "square",
                Math.max(6, Math.min(94, Number(posX) || 50)),
                Math.max(10, Math.min(90, Number(posY) || 50)),
            ]
        );

        return res.rows[0];
    },

    async updateLayoutBatch(tables = []) {
        await this.ensureSchema();
        const client = await pool.connect();
        try {
            await client.query("BEGIN");
            const updated = [];

            for (const item of tables) {
                if (!item || !item.id) continue;
                const posX = Math.max(6, Math.min(94, Number(item.posX ?? item.pos_x ?? 50)));
                const posY = Math.max(10, Math.min(90, Number(item.posY ?? item.pos_y ?? 50)));
                const displayName = item.displayName || item.display_name;
                const tableCode = item.tableCode || item.table_code;
                const capacity = item.capacity ? Math.max(1, Math.min(20, Number(item.capacity))) : null;
                const shape =
                    item.shape && ["square", "round", "rect"].includes(item.shape)
                        ? item.shape
                        : null;

                const res = await client.query(
                    `UPDATE public.restaurant_tables
                     SET pos_x = $1,
                         pos_y = $2,
                         display_name = COALESCE($3, display_name),
                         table_code = COALESCE($4, table_code),
                         capacity = COALESCE($5, capacity),
                         shape = COALESCE($6, shape)
                     WHERE id = $7
                     RETURNING id, table_number, table_code, display_name, floor_id, capacity, shape, pos_x, pos_y, is_active`,
                    [
                        posX,
                        posY,
                        displayName ? String(displayName).trim().slice(0, 60) : null,
                        tableCode ? String(tableCode).trim().toUpperCase().slice(0, 20) : null,
                        capacity,
                        shape,
                        Number(item.id),
                    ]
                );
                if (res.rows[0]) {
                    updated.push(res.rows[0]);
                }
            }

            await client.query("COMMIT");
            return updated;
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            client.release();
        }
    },

    async deleteTable(id) {
        await this.ensureSchema();
        const res = await pool.query(
            `UPDATE public.restaurant_tables
             SET is_active = FALSE
             WHERE id = $1
             RETURNING id, table_number, table_code, display_name`,
            [Number(id)]
        );
        return res.rows[0];
    },
};
