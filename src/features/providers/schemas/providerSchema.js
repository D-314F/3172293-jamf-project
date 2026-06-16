import { z } from "zod";

export const providerSchema = z.object({
    providerDocumentType: z
        .string()
        .min(1, "Seleccione un tipo de documento"),

    providerDocumentNumber: z
        .string()
        .min(5, "Mínimo 5 caracteres")
        .max(20, "Máximo 20 caracteres")
        .regex(/^[0-9]+$/, "Solo se permiten números"),

    providerName: z
        .string()
        .min(3, "El nombre debe tener mínimo 3 caracteres")
        .max(100, "Nombre demasiado largo")
        .regex(/^[a-zA-Z]+$/, "Solo letras, espacios y tildes"),

    providerObservations: z
        .string()
        .max(255, "Máximo 255 caracteres")
        .optional(),

    providerProducts: z
        .string()
        .min(1, "Seleccione una categoría de producto"),

    providerPhone: z
        .string()
        .min(7, "Mínimo 7 dígitos")
        .max(15, "Máximo 15 dígitos")
        .regex(/^[0-9]+$/, "Solo se permiten números"),

    providerEmail: z
        .string()
        .email("Correo electrónico inválido"),

    providerAddress: z
        .string()
        .min(5, "La dirección es requerida")
        .max(150, "Máximo 150 caracteres"),

    providerStatus: z.boolean(),
});