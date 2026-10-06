// src/features/users/schemas/loginSchema.js

import { z } from "zod";

export const loginSchema = z.object({
    userEmail: z
        .email("Debe ingresar un email válido"),

    userPassword: z
        .string()
        .min(8, "La contraseña debe tener al menos 8 caracteres")
        .regex(/[A-Z]/, "Debe tener una mayúscula")
        .regex(/[a-z]/, "Debe tener una minúscula")
        .regex(/[0-9]/, "Debe tener un número")
        .regex(/[^A-Za-z0-9]/, "Debe tener un carácter especial"),
});