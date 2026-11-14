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

export async function getProfile() {
    const token = sessionStorage.getItem("token");

    const response = await fetch(`${AUTH_API_URL}/profile`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Error al obtener el perfil del usuario");
    }

    return data;
}

export function getUserInitials(name = "") {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "U";
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export async function updateProfile(profileData) {
    const token = sessionStorage.getItem("token");

    const response = await fetch(`${AUTH_API_URL}/profile`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            userPhone: profileData.userPhone,
            userAddress: profileData.userAddress,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Error al actualizar los datos de contacto");
    }

    return data.profile;
}