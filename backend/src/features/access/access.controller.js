import accessService from "./access.service.js";

const checkPermission = async (req, res) => {
  try {
    const userId = req.user.id;
    const { permissionCode } = req.params;

    const granted = await accessService.hasPermission(userId, permissionCode);

    return res.json({
      userId,
      permission: permissionCode,
      granted,
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const getMyPermissions = async (req, res) => {
  try {
    const userId = req.user.id;
    const permissions = await accessService.getEffectivePermissions(userId);
    return res.json(permissions);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

export default { checkPermission, getMyPermissions };
