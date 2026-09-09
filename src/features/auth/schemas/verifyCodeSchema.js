import { z } from "zod";

export const verifyCodeSchema = z.object({
  code: z
    .string()
    .min(6, "El código debe tener al menos 6 dígitos")
    .max(6, "El código debe tener exactamente 6 dígitos")
    .regex(/^\d+$/, "El código solo debe contener números"),
});
