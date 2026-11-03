import { userService } from "./user.service.js";

export const userController = {
    async getAll(req, res) {
        try {
            const users = await userService.getAllUsers();
            return res.status(200).json(users);
        } catch (err) {
            console.error("ERROR AL LISTAR USUARIOS:", err.message);
            return res.status(500).json({ error: err.message });
        }
    },

    async getById(req, res) {
        try {
            const { id } = req.params;
            const user = await userService.getUserById(id);
            return res.status(200).json(user);
        } catch (err) {
            console.error("ERROR AL OBTENER USUARIO:", err.message);
            return res.status(404).json({ error: err.message });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const updatedUser = await userService.updateUser(id, req.body);
            return res.status(200).json({
                message: "Usuario actualizado correctamente",
                userId: updatedUser.id,
            });
        } catch (err) {
            console.error("ERROR AL ACTUALIZAR USUARIO:", err.message);
            return res.status(500).json({ error: err.message });
        }
    },

    async create(req, res) {
        try {
            const user = await userService.createUser(req.body);

            res.status(201).json({
                message: "Usuario creado correctamente",
                userId: user.id,
            });
        } catch (err) {
            console.error("ERROR BACKEND:", err.message);

            if (err.code === "23505") {
                return res.status(409).json({
                    error: "Ya existe un usuario con ese correo o documento",
                });
            }

            res.status(500).json({ error: "Error interno del servidor" });
        }
    },
};