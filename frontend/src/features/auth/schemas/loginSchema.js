// src/features/auth/schemas/loginSchema.js
import { z } from "zod";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const loginSchema = z.object({
  userEmail: z
    .string()
    .trim()
    .min(1, "El correo electrónico es requerido")
    .email("Debe ingresar un email válido")
    .refine((value) => EMAIL_PATTERN.test(value), {
      message: "Debe ingresar un email válido",
    }),

  userPassword: z
    .string()
    .min(1, "La contraseña es requerida"),
});