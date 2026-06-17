import { z } from "zod";

export const orderSchema = z.object({
  tableNumber: z.coerce.number()
    .int("Debe ser número de mesa válido")
    .min(1, "Mínimo mesa 1")
    .max(50, "Máximo mesa 50"),
  
  isActive: z.boolean().default(true),
  
  waiterId: z.string()
    .min(1, "Seleccione el mesero responsable"),
  
  dishId: z.string()
    .min(1, "Seleccione un platillo"),
  
  quantity: z.coerce.number()
    .int("Cantidad debe ser número entero")
    .min(1, "Mínimo 1 unidad")
    .max(20, "Máximo 20 por plato"),
  
  observations: z.string()
    .max(255, "Máximo 255 caracteres")
    .optional()
    .or(z.literal('')),
});