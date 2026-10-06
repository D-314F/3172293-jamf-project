import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(10, "La contraseña debe tener al menos 10 caracteres")
      .regex(/[A-Z]/, "Debe incluir al menos una mayúscula")
      .regex(/[a-z]/, "Debe incluir al menos una minúscula")
      .regex(/\d/, "Debe incluir al menos un número")
      .regex(/[\W_]/, "Debe incluir al menos un símbolo"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });
