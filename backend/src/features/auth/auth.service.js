import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authRepository } from "./auth.repository.js";

// Tiempo de bloqueo: exactamente 10 minutos (600 segundos)
// TIP PARA SUSTENTACIÓN: Puedes cambiar el 10 por 1 para que el instructor lo vea en vivo rápido
const LOCK_TIME_MINUTES = 10;

export const authService = {
    async login({ email, password }) {
        const user = await authRepository.findByEmail(email);

        if (!user) {
            const error = new Error("Credenciales inválidas.");
            error.statusCode = 401;
            throw error;
        }

        // 1. Validar si la cuenta está bloqueada temporalmente
        if (user.is_locked) {
            const now = new Date();
            const lockTime = user.locked_until ? new Date(user.locked_until) : null;

            if (lockTime && now < lockTime) {
                const secondsLeft = Math.ceil((lockTime.getTime() - now.getTime()) / 1000);
                const minutesLeft = Math.ceil(secondsLeft / 60);

                const error = new Error(
                    `Cuenta bloqueada tras 3 intentos fallidos consecutivos. Podrás intentar de nuevo en ${minutesLeft} minuto(s).`
                );
                error.code = "ACCOUNT_LOCKED";
                error.secondsLeft = secondsLeft;
                error.lockedUntil = lockTime.toISOString();
                error.statusCode = 423;
                throw error;
            } else {
                // Ya pasaron los 10 minutos: DESBLOQUEO AUTOMÁTICO
                await authRepository.resetFailedAttempts(user.id);
                user.failed_attempts = 0;
                user.is_locked = false;
                user.locked_until = null;
            }
        }

        if (!user.is_active) {
            const error = new Error("Usuario inactivo. Contacte al administrador.");
            error.statusCode = 403;
            throw error;
        }

        const isMatch = await bcrypt.compare(password, user.user_password);

        if (!isMatch) {
            const updated = await authRepository.incrementFailedAttempts(user.id, LOCK_TIME_MINUTES);
            const attempts = updated.failed_attempts;

            if (updated.is_locked || attempts >= 3) {
                const lockTime = updated.locked_until ? new Date(updated.locked_until) : null;
                const secondsLeft = lockTime 
                    ? Math.ceil((lockTime.getTime() - Date.now()) / 1000) 
                    : LOCK_TIME_MINUTES * 60;

                const error = new Error("Cuenta bloqueada tras 3 intentos fallidos consecutivos.");
                error.code = "ACCOUNT_LOCKED";
                error.attempts = 3;
                error.remaining = 0;
                error.secondsLeft = secondsLeft;
                error.lockedUntil = updated.locked_until;
                error.statusCode = 423;
                throw error;
            }

            const remaining = 3 - attempts;
            const error = new Error("Credenciales inválidas.");
            error.code = "INVALID_CREDENTIALS";
            error.attempts = attempts;
            error.remaining = remaining;
            error.statusCode = 401;
            throw error;
        }

        if (user.failed_attempts > 0 || user.is_locked) {
            await authRepository.resetFailedAttempts(user.id);
        }

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

        async getProfile(userId) {
        const user = await authRepository.findProfileById(userId);

        if (!user) {
            const error = new Error("Usuario no encontrado.");
            error.statusCode = 404;
            throw error;
        }

        const groups =
            user.user_groups_list?.length > 0
                ? user.user_groups_list
                : user.role_groups_list?.length > 0
                    ? user.role_groups_list
                    : [user.user_type || "Sin grupo"];

        const startDate = user.user_start_date
            ? new Date(user.user_start_date).toISOString().split("T")[0]
            : "";

        return {
            id: user.id,
            userName: user.user_name,
            userEmail: user.user_email,
            userBusinessEmail: user.user_business_email || "",
            userType: user.user_type || "Usuario",
            groups,
            userDocumentTypes: user.user_document_types || "",
            userDocumentNumber: user.user_document_number || "",
            userPhone: user.user_phone || "",
            userAddress: user.user_address || "",
            userStartDate: startDate,
            userAvatarUrl: user.user_avatar_url || null,
            isActive: user.is_active,
            isSuperuser: user.is_superuser,
        };
    },

        async updateProfile(userId, { userPhone, userAddress }) {
        const cleanPhone = String(userPhone ?? "").trim();
        const cleanAddress = String(userAddress ?? "").trim();

        if (!/^[0-9]{10}$/.test(cleanPhone)) {
            const error = new Error("El teléfono debe tener exactamente 10 dígitos.");
            error.statusCode = 400;
            throw error;
        }

        if (cleanAddress.length < 5 || cleanAddress.length > 100) {
            const error = new Error("La dirección debe tener entre 5 y 100 caracteres.");
            error.statusCode = 400;
            throw error;
        }

        const updated = await authRepository.updateOwnContact(userId, {
            userPhone: cleanPhone,
            userAddress: cleanAddress,
        });

        if (!updated) {
            const error = new Error("Usuario no encontrado.");
            error.statusCode = 404;
            throw error;
        }

        return await this.getProfile(userId);
    },
};