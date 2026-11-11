import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authRepository } from "./auth.repository.js";

export const authService = {
    async login({ email, password }) {
        const user = await authRepository.findByEmail(email);

        // Si el usuario no existe, lanzamos error genérico
        if (!user) {
            const error = new Error("Credenciales inválidas");
            error.statusCode = 401;
            throw error;
        }

       
        if (user.is_locked) {
            const error = new Error("Cuenta bloqueada tras 3 intentos fallidos consecutivos de autenticación.");
            error.code = "ACCOUNT_LOCKED";
            error.statusCode = 423; // 423 Locked
            throw error;
        }

        if (!user.is_active) {
            const error = new Error("Usuario inactivo. Contacte al administrador.");
            error.statusCode = 403;
            throw error;
        }


        const isMatch = await bcrypt.compare(password, user.user_password);

        if (!isMatch) {
   
            const updated = await authRepository.incrementFailedAttempts(user.id);
            const attempts = updated.failed_attempts;

            if (updated.is_locked || attempts >= 3) {
                const error = new Error("Cuenta bloqueada tras 3 intentos fallidos consecutivos de autenticación.");
                error.code = "ACCOUNT_LOCKED";
                error.attempts = 3;
                error.remaining = 0;
                error.statusCode = 423;
                throw error;
            }

            const remaining = 3 - attempts;
            const error = new Error(`Credenciales inválidas. Intento ${attempts} de 3.`);
            error.code = "INVALID_CREDENTIALS";
            error.attempts = attempts;
            error.remaining = remaining;
            error.statusCode = 401;
            throw error;
        }


        if (user.failed_attempts > 0 || user.is_locked) {
            await authRepository.resetFailedAttempts(user.id);
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