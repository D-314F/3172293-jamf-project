import { API_URL } from "@/features/config";

const USERS_URL = `${API_URL}/users`;

// Obtener todos los usuarios (GET /api/users)
export async function getUsers() {
    const token = sessionStorage.getItem("token");

    const response = await fetch(USERS_URL, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al obtener la lista de usuarios");
    }

    return response.json();
}

// Obtener un usuario por su ID (GET /api/users/:id)
export async function getUserById(id) {
    const token = sessionStorage.getItem("token");

    const response = await fetch(`${USERS_URL}/${id}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Error al obtener los datos del usuario");
    }

    return response.json();
}

// Actualizar un usuario (PUT /api/users/:id)
export async function updateUser(id, userData) {
    const token = sessionStorage.getItem("token");

    const response = await fetch(`${USERS_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al actualizar el usuario");
    }

    return response.json();
}

// Crear un nuevo usuario (POST /api/users)
export async function createUser(userData) {
    const token = sessionStorage.getItem("token");

    const response = await fetch(USERS_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al crear usuario");
    }

    return response.json();
}