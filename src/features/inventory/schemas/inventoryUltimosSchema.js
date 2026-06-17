import { z } from "zod";

export const inventoryUltimosSchema = z.object({
    lote: z.string().min(1, "El lote es obligatorio"),
    descripcion: z.string().min(3, "Mínimo 3 caracteres"),
    fechaVencimiento: z.string().min(1, "La fecha es obligatoria"),
    ubicacion: z.string().min(1, "La ubicación es obligatoria"),
    comentarioProducto: z.string().optional(),
});