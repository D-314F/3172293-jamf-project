import { z } from "zod";

export const inventorySchema = z.object({
    marca: z
        .string()
        .min(1, "La marca es obligatoria"),

    cantidad: z
        .string()
        .regex(/^[0-9]+$/, "La cantidad solo puede contener números"),

    codigo: z
        .string()
        .min(3, "El código es obligatorio")
        .max(30, "Código demasiado largo")
        .regex(
            /^[a-zA-Z0-9]+$/,
            "El código no puede contener caracteres especiales"
        ),

    cantidadTotal: z
        .string()
        .regex(/^[0-9]+$/, "La cantidad total solo puede contener números"),

    nombre: z
        .string()
        .min(3, "El nombre debe tener mínimo 3 caracteres")
        .max(100, "Nombre demasiado largo")
        .regex(
            /^[a-zA-Z]+$/,
            "El nombre solo puede contener letras"
        ),

    cantidadMinima: z
        .string()
        .regex(/^[0-9]+$/, "La cantidad mínima solo puede contener números"),

    codigoBarras: z
        .string()
        .regex(
            /^[0-9]+$/,
            "El código de barras solo puede contener números"
        ),

    valorUnitario: z
        .string()
        .regex(
            /^[0-9]+$/,
            "El valor unitario solo puede contener números"
        ),

    cuentadante: z
        .string()
        .min(1, "Debe seleccionar un cuentadante"),

    valorTotal: z
        .string()
        .regex(
            /^[0-9]+$/,
            "El valor total solo puede contener números"
        ),
});