import groupsRepository from "./groups.repository.js";

const getAllGroups = async () => {
    return await groupsRepository.getAllGroups();
    };

    const getGroupPermissions = async (groupId) => {
    return await groupsRepository.getGroupPermissions(groupId);
    };

    const updateGroupPermissions = async (groupId, permissionIds) => {
    if (!Array.isArray(permissionIds)) {
        throw new Error("permissionIds debe ser un array");
    }
    await groupsRepository.updateGroupPermissions(groupId, permissionIds);
};

export default { getAllGroups, getGroupPermissions, updateGroupPermissions };