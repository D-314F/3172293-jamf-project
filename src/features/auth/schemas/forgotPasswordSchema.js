import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "El correo es obligatorio")
    .email("Por favor ingresa un correo válido"),
});
