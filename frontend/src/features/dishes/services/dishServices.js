import { API_URL } from "@/features/config";

const DISHES_URL = `${API_URL}/dishes`;

// Obtener todos los platillos (GET /api/dishes)
export async function getDishes() {
    const token = sessionStorage.getItem("token");

    const response = await fetch(DISHES_URL, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al obtener los platillos");
    }

    return response.json();
}

// Obtener platillo por ID (GET /api/dishes/:id)
export async function getDishById(id) {
    const token = sessionStorage.getItem("token");

    const response = await fetch(`${DISHES_URL}/${id}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Error al obtener los datos del platillo");
    }

    return response.json();
}

// Actualizar platillo (PUT /api/dishes/:id)
export async function updateDish(id, dishData) {
    const token = sessionStorage.getItem("token");

    const response = await fetch(`${DISHES_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dishData),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al actualizar el platillo");
    }

    return response.json();
}

// Crear platillo (POST /api/dishes)
export async function createDish(dishData) {
    const token = sessionStorage.getItem("token");

    const response = await fetch(DISHES_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dishData),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al crear el platillo");
    }

    return response.json();
}