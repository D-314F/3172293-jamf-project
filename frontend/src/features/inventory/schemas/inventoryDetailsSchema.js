import { z } from "zod";

export const inventoryDetailsSchema = z.object({
    lote: z
        .string()
        .min(1, "El lote es obligatorio"),

    descripcion: z
        .string()
        .min(3, "La descripción debe tener al menos 3 caracteres"),

    fechaVencimiento: z
        .string()
        .min(1, "La fecha de vencimiento es obligatoria"),

    ubicacion: z
        .string()
        .min(1, "La ubicación es obligatoria"),

    comentarioProducto: z
        .string()
        .optional(),
});