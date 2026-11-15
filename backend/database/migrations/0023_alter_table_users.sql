-- 1. Agregar columnas de teléfono secundario y grupo operativo a la tabla users
ALTER TABLE users
ADD COLUMN IF NOT EXISTS user_secondary_phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS user_group VARCHAR(50);