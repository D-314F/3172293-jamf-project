import permissionsService from "./permissions.service.js";
import accessService from "../access/access.service.js";

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
    const permissions = await permissionsService.getEffectiveOrAssignedUserPermissions(
      req.params.userId
    );
    res.json(permissions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateUserPermissions = async (req, res) => {
  try {
    const { permissionIds } = req.body;
    const actorId = req.user?.id;

    // Regla 1.16: Un administrador NUNCA podrá asignar permisos más allá de los que él tiene
    if (actorId && Array.isArray(permissionIds)) {
      const actorPerms = await accessService.getEffectivePermissions(actorId);
      const actorPermIds = new Set(actorPerms.map((p) => Number(p.permission_id)));
      const targetCurrentPerms = await permissionsService.getEffectiveOrAssignedUserPermissions(
        req.params.userId
      );
      const targetCurrentIds = new Set(
        targetCurrentPerms.map((p) => Number(p.permission_id))
      );

      for (const pid of permissionIds) {
        const numericId = Number(pid);
        // Si intenta agregar un permiso nuevo que él mismo no posee, bloquear
        if (!actorPermIds.has(numericId) && !targetCurrentIds.has(numericId)) {
          return res.status(403).json({
            error:
              "No puedes asignar permisos que tu cuenta actual no posee.",
          });
        }
      }
    }

    await permissionsService.updateUserPermissions(
      req.params.userId,
      permissionIds
    );
    res.json({ message: "Permisos del usuario actualizados correctamente" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export default {
  getAllPermissions,
  getUserPermissions,
  updateUserPermissions,
};
