-- Migración 0006: Agregar columna status de tipo texto para los 4 estados
ALTER TABLE public.inventory 
ADD COLUMN IF NOT EXISTS status VARCHAR(30) DEFAULT 'Disponible';

-- Actualizar productos existentes
UPDATE public.inventory 
SET status = 'Disponible' 
WHERE status IS NULL;