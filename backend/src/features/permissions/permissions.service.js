import permissionsRepository from "./permissions.repository.js";

const getAllPermissions = async () => {
    return await permissionsRepository.getAllPermissions();
    };

    const getUserPermissions = async (userId) => {
    return await permissionsRepository.getUserPermissions(userId);
    };

    const updateUserPermissions = async (userId, permissionIds) => {
    if (!Array.isArray(permissionIds)) {
        throw new Error("permissionIds debe ser un array");
    }
    await permissionsRepository.updateUserPermissions(userId, permissionIds);
};

export default { getAllPermissions, getUserPermissions, updateUserPermissions };