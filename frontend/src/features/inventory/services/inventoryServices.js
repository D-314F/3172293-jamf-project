import { API_URL } from "@/features/config";

// El recurso se concatena a la base: http://localhost:4000/api/inventory
const INVENTORY_URL = `${API_URL}/inventory`;

// Envía los datos del inventario al backend y devuelve la respuesta en JSON
export async function createInventory(inventoryData) {
    const response = await fetch(INVENTORY_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(inventoryData),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al registrar el inventario");
    }

    return response.json();
}