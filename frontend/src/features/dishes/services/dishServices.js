import { API_URL } from "@/features/config";

// El recurso se concatena a la base: http://localhost:4000/api/dishes
const DISHES_URL = `${API_URL}/dishes`;

// Envía los datos del platillo al backend y devuelve la respuesta en JSON
export async function createDish(dishData) {
    const response = await fetch(DISHES_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(dishData),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al crear el platillo");
    }

    return response.json();
}