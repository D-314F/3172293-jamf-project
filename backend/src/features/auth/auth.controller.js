import { authService } from "./auth.service.js";

export const authController = {
    async login(req, res) {
        try {
            const result = await authService.login(req.body);

            res.status(200).json({
                message: "Login exitoso",
                ...result,
            });
        } catch (err) {
            const status = err.statusCode || 401;
            res.status(status).json({
                error: err.message,
                code: err.code || "AUTH_ERROR",
                attempts: err.attempts,
                remaining: err.remaining,
                secondsLeft: err.secondsLeft,
                lockedUntil: err.lockedUntil,
            });
        }
    },

        async getProfile(req, res) {
        try {
            const profile = await authService.getProfile(req.user.id);
            res.status(200).json(profile);
        } catch (err) {
            const status = err.statusCode || 500;
            res.status(status).json({ error: err.message });
        }
    },

        async updateProfile(req, res) {
        try {
            // Toma el id únicamente del JWT verificado, nunca de la URL o del body
            const updatedProfile = await authService.updateProfile(req.user.id, req.body);
            res.status(200).json({
                message: "Datos de contacto actualizados correctamente",
                profile: updatedProfile,
            });
        } catch (err) {
            const status = err.statusCode || 500;
            res.status(status).json({ error: err.message });
        }
    },
};