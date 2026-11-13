import { API_URL } from "@/features/config";

export const getAllPermissions = async () => {
    const token = sessionStorage.getItem("token");
    const response = await fetch(`${API_URL}/permissions`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Error al obtener el catálogo de permisos");
    return response.json();
    };

    export const getGroups = async () => {
    const token = sessionStorage.getItem("token");
    const response = await fetch(`${API_URL}/groups`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Error al obtener los grupos");
    return response.json();
    };

    export const getGroupPermissions = async (groupId) => {
    const token = sessionStorage.getItem("token");
    const response = await fetch(`${API_URL}/groups/${groupId}/permissions`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Error al obtener permisos del grupo");
    return response.json();
};

export const updateGroupPermissions = async (groupId, permissionIds) => {
    const token = sessionStorage.getItem("token");
    const response = await fetch(`${API_URL}/groups/${groupId}/permissions`, {
        method: "PUT",
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ permissionIds }),
    });
    if (!response.ok) throw new Error("Error al actualizar permisos del grupo");
    return response.json();
    };

    export const getUserPermissions = async (userId) => {
    const token = sessionStorage.getItem("token");
    const response = await fetch(`${API_URL}/permissions/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Error al obtener permisos del usuario");
    return response.json();
    };

    export const updateUserPermissions = async (userId, permissionIds) => {
    const token = sessionStorage.getItem("token");
    const response = await fetch(`${API_URL}/permissions/user/${userId}`, {
        method: "PUT",
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ permissionIds }),
    });
    if (!response.ok) throw new Error("Error al actualizar permisos del usuario");
    return response.json();
    };

    export const hasPermission = async (permissionCode) => {
    const token = sessionStorage.getItem("token");
    const response = await fetch(`${API_URL}/access/check/${permissionCode}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) return false;
    const data = await response.json();
    return Boolean(data.granted);
};