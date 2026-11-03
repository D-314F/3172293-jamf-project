import { API_URL } from "@/features/config";

const INVENTORY_URL = `${API_URL}/inventory`;

// Obtener todo el inventario (GET /api/inventory)
export async function getInventory() {
    const token = sessionStorage.getItem("token");

    const response = await fetch(INVENTORY_URL, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al obtener el inventario");
    }

    return response.json();
}

// Obtener producto por ID (GET /api/inventory/:id)
export async function getInventoryById(id) {
    const token = sessionStorage.getItem("token");

    const response = await fetch(`${INVENTORY_URL}/${id}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Error al obtener los datos del producto");
    }

    return response.json();
}

// Actualizar inventario (PUT /api/inventory/:id)
export async function updateInventory(id, inventoryData) {
    const token = sessionStorage.getItem("token");

    const response = await fetch(`${INVENTORY_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(inventoryData),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al actualizar el producto");
    }

    return response.json();
}

// Crear producto en inventario (POST /api/inventory)
export async function createInventory(inventoryData) {
    const token = sessionStorage.getItem("token");

    const response = await fetch(INVENTORY_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(inventoryData),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al registrar el inventario");
    }

    return response.json();
}