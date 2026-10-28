import { API_URL } from "@/features/config";

// El recurso se concatena a la base: http://localhost:4000/api/providers
const PROVIDERS_URL = `${API_URL}/providers`;

// Envía los datos del proveedor al backend y devuelve la respuesta en JSON
export async function createProvider(providerData) {
    const response = await fetch(PROVIDERS_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(providerData),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al crear el proveedor");
    }

    return response.json();
}