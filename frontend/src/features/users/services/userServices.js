import { API_URL } from "@/features/config";

// El recurso se concatena a la base: http://localhost:4000/api/users
const USERS_URL = `${API_URL}/users`;

// Envía los datos del usuario al backend y devuelve la respuesta en JSON
export async function createUser(userData) {
    const response = await fetch(USERS_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });

    // Si el backend responde con error (409, 500...), lanzamos una excepción
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al crear usuario");
    }

    return response.json();
}