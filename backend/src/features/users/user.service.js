import bcrypt from "bcrypt";
import { userRepository } from "./user.repository.js";

export const userService = {
    async createUser(data) {
        // Encriptamos la contraseña antes de guardarla (nunca se guarda en texto plano)
        const hashedPassword = await bcrypt.hash(data.userPassword, 10);

        const userData = {
            ...data,
            userPassword: hashedPassword,
            // Una fecha vacía debe ir como null, PostgreSQL rechaza ""
            userStartDate: data.userStartDate || null,
            userEndDate: data.userEndDate || null,
            // La imagen aún no se guarda
            userAvatarUrl: null,
            // Valores por defecto de los flags si el formulario no los envía
            isStaff: data.isStaff ?? false,
            isActive: data.isActive ?? true,
            isSuperuser: data.isSuperuser ?? false,
        };

        return await userRepository.create(userData);
    },
};