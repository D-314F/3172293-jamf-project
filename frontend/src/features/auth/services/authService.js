import { API_URL } from "@/features/config";

const AUTH_API_URL = `${API_URL}/auth`;

export async function login(userData) {
    const response = await fetch(`${AUTH_API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: userData.userEmail,
            password: userData.userPassword,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        const error = new Error(data.error || "Error al iniciar sesión");
        error.code = data.code;
        error.attempts = data.attempts;
        error.remaining = data.remaining;
        error.secondsLeft = data.secondsLeft;
        error.lockedUntil = data.lockedUntil;
        throw error;
    }

    return data;
}