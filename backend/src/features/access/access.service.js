import accessRepository from "./access.repository.js";

const hasPermission = async (userId, permissionCode) => {
    if (!userId || !permissionCode) {
        throw new Error("userId y permissionCode son requeridos");
    }

    const superUser = await accessRepository.isSuperUser(userId);
    if (superUser) return true;

    return await accessRepository.userHasPermission(userId, permissionCode);
};

export default { hasPermission };