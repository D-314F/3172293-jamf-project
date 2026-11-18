import { API_URL } from "@/features/config";
import { resolveUploadedImageUrl } from "@/shared";

const PROVIDERS_URL = `${API_URL}/providers`;

async function attachProviderImage(providerData) {
  const payload = { ...providerData };
  const uploadedUrl = await resolveUploadedImageUrl(
    payload.providerImage || payload.userImage,
    "providers"
  );

  if (uploadedUrl) {
    payload.providerImageUrl = uploadedUrl;
  }

  delete payload.providerImage;
  delete payload.userImage;
  return payload;
}

// Obtener todos los proveedores (GET /api/providers)
export async function getProviders() {
  const token = sessionStorage.getItem("token");

  const response = await fetch(PROVIDERS_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Error al obtener los proveedores");
  }

  return response.json();
}

// Obtener proveedor por ID (GET /api/providers/:id)
export async function getProviderById(id) {
  const token = sessionStorage.getItem("token");

  const response = await fetch(`${PROVIDERS_URL}/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error al obtener los datos del proveedor");
  }

  return response.json();
}

// Actualizar proveedor (PUT /api/providers/:id)
export async function updateProvider(id, providerData) {
  const token = sessionStorage.getItem("token");
  const payload = await attachProviderImage(providerData);

  const response = await fetch(`${PROVIDERS_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Error al actualizar el proveedor");
  }

  return response.json();
}

// Crear proveedor (POST /api/providers)
export async function createProvider(providerData) {
  const token = sessionStorage.getItem("token");
  const payload = await attachProviderImage(providerData);

  const response = await fetch(PROVIDERS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Error al crear el proveedor");
  }

  return response.json();
}
