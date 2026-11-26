import groupsService from "./groups.service.js";
import accessService from "../access/access.service.js";

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
    const permissions = await groupsService.getGroupPermissions(
      req.params.groupId
    );
    res.json(permissions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateGroupPermissions = async (req, res) => {
  try {
    const { permissionIds } = req.body;
    const actorId = req.user?.id;

    // Regla 1.16: Un administrador NUNCA podrá asignar permisos más allá de los que él tiene
    if (actorId && Array.isArray(permissionIds)) {
      const actorPerms = await accessService.getEffectivePermissions(actorId);
      const actorPermIds = new Set(actorPerms.map((p) => Number(p.permission_id)));
      const currentGroupPerms = await groupsService.getGroupPermissions(
        req.params.groupId
      );
      const currentGroupIds = new Set(
        currentGroupPerms.map((p) => Number(p.permission_id))
      );

      for (const pid of permissionIds) {
        const numericId = Number(pid);
        if (!actorPermIds.has(numericId) && !currentGroupIds.has(numericId)) {
          return res.status(403).json({
            error:
              "No puedes asignar permisos que tu cuenta actual no posee.",
          });
        }
      }
    }

    await groupsService.updateGroupPermissions(
      req.params.groupId,
      permissionIds
    );
    res.json({ message: "Permisos del grupo actualizados correctamente" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export default { getAllGroups, getGroupPermissions, updateGroupPermissions };
