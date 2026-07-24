// src/users/schemas/userSchemas.js
// CORRECCION: agregar campos boolenos

import { z } from "zod";
import { fileSchema } from "@/shared/schemas/fileSchema";


export const userSchema = z.object({
    userName: z
    .string()
    .min(3, "El nombre debe tener mínimo 3 caracteres")
    .max(60, "El nombre es demasiado largo"),

    userEmail: z
        .string()
        .email("Debe ingresar un email válido")
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Debe ingresar un email válido"),
    userPhone: z
        .string()
        .regex(/^[0-9]{10}$/, "El teléfono debe tener 10 dígitos"),
    // ===== CAMPOS NUEVOS =====
    userBusinessEmail: z
        .string()
        .email("Debe ingresar un email empresarial válido")
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Debe ingresar un email empresarial válido"),

    userAddress: z
        .string()
        .min(5, "La dirección residencial es requerida")
        .max(100, "La dirección es demasiado larga"),

    userStartDate: z
        .string()
        .min(1, "La fecha de inicio laboral es requerida"), // Para inputs type="date"

    userEndDate: z
        .string()
        .min(1, "La fecha de fin laboral es requerida"),
        
    userDocumentTypes: z.string().min(1, "El tipo de documento es requerido"),
    userType: z.string().min(1, "El tipo de usuario es requerido"),

    userDocumentNumber: z
        .string()
        .min(5, "Numero de documento inválido")
        .max(20, "Número de documento demasiado largo"),

    // userPassword: z
    //     .string()
    //     .min(8, "Contraseña debe tener mínimo 8 caracteres")
    //     .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
    //     .regex(/[a-z]/, "Debe contener al menos una minúscula")
    //     .regex(/[0-9]/, "Debe contener al menos un número")
    //     .regex(/[^A-Za-z0-9]/, "Debe contener al menos un carácter especial"),

    // isStaff: z.boolean(),
    isActive: z.boolean(),
    // isSuperUser:z.boolean(),

    userImage: fileSchema.shape.files.optional()

})