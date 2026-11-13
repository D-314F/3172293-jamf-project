import groupsService from "./groups.service.js";

const getAllGroups = async (req, res) => {
    try {
        const groups = await groupsService.getAllGroups();
        res.json(groups);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
    };

    const getGroupPermissions = async (req, res) => {
    try {
        const permissions = await groupsService.getGroupPermissions(req.params.groupId);
        res.json(permissions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
    };

    const updateGroupPermissions = async (req, res) => {
    try {
        const { permissionIds } = req.body;
        await groupsService.updateGroupPermissions(req.params.groupId, permissionIds);
        res.json({ message: "Permisos del grupo actualizados correctamente" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export default { getAllGroups, getGroupPermissions, updateGroupPermissions };