import { z } from "zod";

export const editInventorySchema = z.object({
  id: z.any().optional(),

  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "Nombre demasiado largo"),

  barcode: z
    .string()
    .min(3, "El código de barras debe tener mínimo 3 caracteres")
    .regex(/^[a-zA-Z0-9]+$/, "El código de barras no puede contener caracteres especiales"),

  quantity: z
    .string()
    .min(1, "La cantidad es obligatoria")
    .regex(/^[0-9]+$/, "La cantidad solo puede contener números"),

  unitPrice: z
    .string()
    .min(1, "El precio unitario es obligatorio")
    .regex(/^[0-9]+$/, "El precio solo puede contener números"),

  brand: z
    .string()
    .min(1, "La marca es obligatoria"),

  lote: z
    .string()
    .min(1, "El lote es obligatorio")
    .regex(/^[a-zA-Z0-9]+$/, "El lote solo puede contener letras y números"),

  status: z.string().optional(),
  userImage: z.any().optional(),
}).passthrough();