-- 0026_create_restaurant_tables.sql
-- Módulo de gestión interactiva 2D de pisos y mesas del restaurante JAMF

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

-- Semilla inicial por defecto (Piso 1 con mesas A1..A8 y Piso 2 con mesas B1..B4)
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
