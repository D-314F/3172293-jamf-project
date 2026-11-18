import { API_URL } from "@/features/config";
import { resolveUploadedImageUrl } from "@/shared";

const DISHES_URL = `${API_URL}/dishes`;

// Obtener todos los platillos (GET /api/dishes)
export async function getDishes() {
  const token = sessionStorage.getItem("token");

  const response = await fetch(DISHES_URL, {
    method: "GET",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
  const uploadedUrl = await resolveUploadedImageUrl(
    dishData.dishImage || dishData.userImage,
    "products"
  );

  const payload = {
    ...dishData,
    ...(uploadedUrl ? { dishImageUrl: uploadedUrl } : {}),
  };
  delete payload.dishImage;
  delete payload.userImage;

  const response = await fetch(`${DISHES_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
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
  const uploadedUrl = await resolveUploadedImageUrl(
    dishData.userImage || dishData.dishImage,
    "products"
  );

  const payload = {
    ...dishData,
    ...(uploadedUrl ? { dishImageUrl: uploadedUrl } : {}),
  };
  delete payload.userImage;
  delete payload.dishImage;

  const response = await fetch(DISHES_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Error al crear el platillo");
  }

  return response.json();
}
