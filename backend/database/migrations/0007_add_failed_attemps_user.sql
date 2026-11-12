-- Migración 0007: Campos para bloqueo por intentos fallidos (RNF11)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS failed_attempts INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_locked BOOLEAN DEFAULT FALSE;