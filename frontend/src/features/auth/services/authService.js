import { API_URL } from "@/features/config";

const AUTH_API_URL = `${API_URL}/auth`;

// Envía las credenciales al backend y devuelve { token, user }
export async function login(userData) {
    const response = await fetch(`${AUTH_API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        // El backend espera "email" y "password", no los nombres del formulario
        body: JSON.stringify({
            email: userData.userEmail,
            password: userData.userPassword,
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al iniciar sesión");
    }

    return response.json();
}