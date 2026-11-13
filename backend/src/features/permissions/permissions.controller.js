import permissionsService from "./permissions.service.js";

const getAllPermissions = async (req, res) => {
    try {
        const permissions = await permissionsService.getAllPermissions();
        res.json(permissions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
    };

    const getUserPermissions = async (req, res) => {
    try {
        const permissions = await permissionsService.getUserPermissions(req.params.userId);
        res.json(permissions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
    };

    const updateUserPermissions = async (req, res) => {
    try {
        const { permissionIds } = req.body;
        await permissionsService.updateUserPermissions(req.params.userId, permissionIds);
        res.json({ message: "Permisos del usuario actualizados correctamente" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export default { getAllPermissions, getUserPermissions, updateUserPermissions };