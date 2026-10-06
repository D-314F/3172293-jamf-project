import { userService } from "./user.service.js";

export const userController = {
    async create(req, res) {
        try {
            const user = await userService.createUser(req.body);

            // 201: recurso creado. Solo devolvemos el id, nunca la contraseña
            res.status(201).json({
                message: "Usuario creado correctamente",
                userId: user.id,
            });
        } catch (err) {
            console.error("ERROR BACKEND:", err.message);

            // 23505 es el código de PostgreSQL para "valor duplicado" (correo o documento)
            if (err.code === "23505") {
                return res.status(409).json({
                    error: "Ya existe un usuario con ese correo o documento",
                });
            }

            res.status(500).json({ error: "Error interno del servidor" });
        }
    },
};