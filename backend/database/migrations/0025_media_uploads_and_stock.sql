-- Migración 0025: Tabla de metadatos multimedia (uploads) y relación de stock Inventario -> Platillos

CREATE TABLE IF NOT EXISTS public.media_files (
    id SERIAL PRIMARY KEY,
    folder VARCHAR(40) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    hash_name VARCHAR(255) UNIQUE NOT NULL,
    file_url TEXT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    size_bytes INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.dishes
    ADD COLUMN IF NOT EXISTS inventory_id INTEGER REFERENCES public.inventory(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS dish_stock INTEGER NOT NULL DEFAULT 15;

-- Vincular cada platillo base con su URL física en backend/uploads/products/, su stock y su insumo principal en inventory
UPDATE public.dishes SET dish_image_url = '/uploads/products/bf-8.png',  inventory_id = 3, dish_stock = 15 WHERE dish_name ILIKE 'Torta at%';
UPDATE public.dishes SET dish_image_url = '/uploads/products/bf-13.png', inventory_id = 1, dish_stock = 15 WHERE dish_name ILIKE 'Carpaccio%';
UPDATE public.dishes SET dish_image_url = '/uploads/products/bf-9.png',  inventory_id = 2, dish_stock = 15 WHERE dish_name ILIKE 'Magret%';
UPDATE public.dishes SET dish_image_url = '/uploads/products/bf-7.png',  inventory_id = 1, dish_stock = 15 WHERE dish_name ILIKE 'Bistec turco%';
UPDATE public.dishes SET dish_image_url = '/uploads/products/bf-6.png',  inventory_id = 3, dish_stock = 15 WHERE dish_name ILIKE 'Salm%';
UPDATE public.dishes SET dish_image_url = '/uploads/products/bf-5.png',  inventory_id = 2, dish_stock = 15 WHERE dish_name ILIKE 'Roulade%';
UPDATE public.dishes SET dish_image_url = '/uploads/products/bf-10.png', inventory_id = 2, dish_stock = 15 WHERE dish_name ILIKE 'Pechuga a la naranja%';
UPDATE public.dishes SET dish_image_url = '/uploads/products/home-1.png',inventory_id = 1, dish_stock = 15 WHERE dish_name ILIKE 'Bandeja especial JAMF%';
UPDATE public.dishes SET dish_image_url = '/uploads/products/bf-14.png', inventory_id = 4, dish_stock = 20 WHERE dish_name ILIKE 'Ensalada C%';
UPDATE public.dishes SET dish_image_url = '/uploads/products/bf-15.png', inventory_id = 4, dish_stock = 20 WHERE dish_name ILIKE 'Ensalada mediterr%';
UPDATE public.dishes SET dish_image_url = '/uploads/products/bf-17.png', inventory_id = 8, dish_stock = 12 WHERE dish_name ILIKE 'Souff%';
UPDATE public.dishes SET dish_image_url = '/uploads/products/bf-18.png', inventory_id = 8, dish_stock = 12 WHERE dish_name ILIKE 'Pavlova%';
UPDATE public.dishes SET dish_image_url = '/uploads/products/bf-16.png', inventory_id = 7, dish_stock = 25 WHERE dish_name ILIKE 'Limonada%';

INSERT INTO public.media_files (folder, original_name, hash_name, file_url, mime_type, size_bytes) VALUES
    ('products', 'bf-5.png',  'bf-5.png',  '/uploads/products/bf-5.png',  'image/png', 35670),
    ('products', 'bf-6.png',  'bf-6.png',  '/uploads/products/bf-6.png',  'image/png', 107890),
    ('products', 'bf-7.png',  'bf-7.png',  '/uploads/products/bf-7.png',  'image/png', 352130),
    ('products', 'bf-8.png',  'bf-8.png',  '/uploads/products/bf-8.png',  'image/png', 181840),
    ('products', 'bf-9.png',  'bf-9.png',  '/uploads/products/bf-9.png',  'image/png', 41970),
    ('products', 'bf-10.png', 'bf-10.png', '/uploads/products/bf-10.png', 'image/png', 44580),
    ('products', 'bf-13.png', 'bf-13.png', '/uploads/products/bf-13.png', 'image/png', 63260),
    ('products', 'bf-14.png', 'bf-14.png', '/uploads/products/bf-14.png', 'image/png', 56520),
    ('products', 'bf-15.png', 'bf-15.png', '/uploads/products/bf-15.png', 'image/png', 214250),
    ('products', 'bf-16.png', 'bf-16.png', '/uploads/products/bf-16.png', 'image/png', 31120),
    ('products', 'bf-17.png', 'bf-17.png', '/uploads/products/bf-17.png', 'image/png', 18000),
    ('products', 'bf-18.png', 'bf-18.png', '/uploads/products/bf-18.png', 'image/png', 101320),
    ('products', 'home-1.png','home-1.png','/uploads/products/home-1.png','image/png', 124840)
ON CONFLICT (hash_name) DO NOTHING;
