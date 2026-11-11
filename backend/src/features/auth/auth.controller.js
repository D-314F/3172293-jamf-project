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
            });
        }
    },
};