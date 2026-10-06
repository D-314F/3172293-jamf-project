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
            // 401: no autorizado (credenciales inválidas o usuario inactivo)
            res.status(401).json({ error: err.message });
        }
    },
};