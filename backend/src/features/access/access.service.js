import accessRepository from "./access.repository.js";

const hasPermission = async (userId, permissionCode) => {
  if (!userId || !permissionCode) {
    throw new Error("userId y permissionCode son requeridos");
  }

  return await accessRepository.userHasPermission(userId, permissionCode);
};

const getEffectivePermissions = async (userId) => {
  if (!userId) {
    throw new Error("userId es requerido");
  }

  return await accessRepository.getUserEffectivePermissions(userId);
};

export default { hasPermission, getEffectivePermissions };
