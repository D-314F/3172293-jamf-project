import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authRepository } from "./auth.repository.js";

export const authService = {
    async login({ email, password }) {
        const user = await authRepository.findByEmail(email);

        // Mismo mensaje si no existe el usuario o la clave falla,
        // así no se revela cuáles correos están registrados
        if (!user) {
            throw new Error("Credenciales inválidas");
        }

        // Compara la contraseña escrita con el hash guardado
        const isMatch = await bcrypt.compare(password, user.user_password);

        if (!isMatch) {
            throw new Error("Credenciales inválidas");
        }

        if (!user.is_active) {
            throw new Error("Usuario inactivo");
        }

        // Genera el token con los datos mínimos
        const token = jwt.sign(
            { id: user.id, email: user.user_email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES },
        );

        return {
            token,
            user: {
                id: user.id,
                name: user.user_name,
                email: user.user_email,
            },
        };
    },
};