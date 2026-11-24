import permissionsRepository from "./permissions.repository.js";
import accessRepository from "../access/access.repository.js";

const getAllPermissions = async () => {
  return await permissionsRepository.getAllPermissions();
};

const getUserPermissions = async (userId) => {
  return await permissionsRepository.getUserPermissions(userId);
};

/**
 * Si el usuario ya tiene permisos individuales en `user_permissions`, los devuelve.
 * Si no, devuelve los permisos efectivos heredados de su grupo para que en PermissionForm
 * se vean reflejados los permisos reales que tiene activos actualmente.
 */
const getEffectiveOrAssignedUserPermissions = async (userId) => {
  const direct = await permissionsRepository.getUserPermissions(userId);
  if (direct.length > 0) return direct;
  return await accessRepository.getUserEffectivePermissions(userId);
};

const updateUserPermissions = async (userId, permissionIds) => {
  if (!Array.isArray(permissionIds)) {
    throw new Error("permissionIds debe ser un array");
  }
  await permissionsRepository.updateUserPermissions(userId, permissionIds);
};

export default {
  getAllPermissions,
  getUserPermissions,
  getEffectiveOrAssignedUserPermissions,
  updateUserPermissions,
};
