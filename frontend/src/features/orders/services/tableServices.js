import { API_URL } from "@/features/config";

const TABLES_URL = `${API_URL}/tables`;

// Obtener pisos y mesas (GET /api/tables)
export async function getFloorsAndTables() {
    const token = sessionStorage.getItem("token");

    const response = await fetch(TABLES_URL, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || "Error al obtener los pisos y mesas");
    }

    return response.json();
}

// Crear nueva mesa (POST /api/tables)
export async function createRestaurantTable(tableData) {
    const token = sessionStorage.getItem("token");

    const response = await fetch(TABLES_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(tableData),
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || "Error al crear la mesa");
    }

    return response.json();
}

// Crear nuevo piso (POST /api/tables/floors)
export async function createRestaurantFloor(floorData) {
    const token = sessionStorage.getItem("token");

    const response = await fetch(`${TABLES_URL}/floors`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(floorData),
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || "Error al crear el piso");
    }

    return response.json();
}

// Guardar distribución y posiciones de mesas (PUT /api/tables/layout)
export async function saveTablesLayout(tables) {
    const token = sessionStorage.getItem("token");

    const response = await fetch(`${TABLES_URL}/layout`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tables }),
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || "Error al guardar la distribución de las mesas");
    }

    return response.json();
}

// Eliminar mesa (DELETE /api/tables/:id)
export async function deleteRestaurantTable(tableId) {
    const token = sessionStorage.getItem("token");

    const response = await fetch(`${TABLES_URL}/${tableId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || "Error al eliminar la mesa");
    }

    return response.json();
}
