import { API_URL } from "@/features/config";

// El recurso se concatena a la base: http://localhost:4000/api/orders
const ORDERS_URL = `${API_URL}/orders`;

// Envía los datos de la orden al backend y devuelve la respuesta en JSON
export async function createOrder(orderData) {
    const response = await fetch(ORDERS_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al crear la orden");
    }

    return response.json();
}