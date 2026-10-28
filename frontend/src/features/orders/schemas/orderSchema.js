import { z } from "zod";

export const orderSchema = z.object({
  tableNumber: z.coerce.number()
    .int("Debe ser número de mesa válido")
    .min(1, "Mínimo mesa 1")
    .max(50, "Máximo mesa 50"),

  waiterId: z.string()
    .min(1, "Seleccione el mesero responsable"),

  dishId: z.string()
    .min(1, "Seleccione un platillo")
    .optional(),

  quantity: z.coerce.number()
    .int("Cantidad inválida")
    .min(1, "Mínimo 1 platillo")
    .optional(),

  estado: z.string()
    .min(1, "Seleccione el estado de la orden")
    .default("Pendiente"),

  isActive: z.boolean().default(true),

  observations: z.string()
    .max(255, "Máximo 255 caracteres")
    .optional()
    .or(z.literal('')),
});