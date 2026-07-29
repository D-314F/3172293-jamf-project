import { z } from 'zod';

export const dishSchema = z.object({
  nombre: z
    .string()
    .min(3, "Mínimo 3 caracteres")
    .max(50, "Máximo 50 caracteres"),
  precio: z
    .string()
    .min(1, "El precio es obligatorio")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Precio inválido"),
  categoria: z
    .string()
    .min(1, "Selecciona una categoría"),
  descripcion: z
    .string()
    .min(10, "Mínimo 10 caracteres")
    .max(200, "Máximo 200 caracteres")
});