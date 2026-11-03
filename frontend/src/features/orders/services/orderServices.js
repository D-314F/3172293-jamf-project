import { API_URL } from "@/features/config";

const ORDERS_URL = `${API_URL}/orders`;

// Obtener todas las órdenes (GET /api/orders)
export async function getOrders() {
    const token = sessionStorage.getItem("token");

    const response = await fetch(ORDERS_URL, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al obtener las órdenes");
    }

    return response.json();
}

// Obtener orden por ID (GET /api/orders/:id)
export async function getOrderById(id) {
    const token = sessionStorage.getItem("token");

    const response = await fetch(`${ORDERS_URL}/${id}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Error al obtener los datos de la orden");
    }

    return response.json();
}

// Actualizar orden (PUT /api/orders/:id)
export async function updateOrder(id, orderData) {
    const token = sessionStorage.getItem("token");

    const response = await fetch(`${ORDERS_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al actualizar la orden");
    }

    return response.json();
}

// Crear orden (POST /api/orders)
export async function createOrder(orderData) {
    const token = sessionStorage.getItem("token");

    const response = await fetch(ORDERS_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al crear la orden");
    }

    return response.json();
}