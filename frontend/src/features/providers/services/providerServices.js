import { API_URL } from "@/features/config";

const PROVIDERS_URL = `${API_URL}/providers`;

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

async function attachProviderImage(providerData) {
  const payload = { ...providerData };
  const files = payload.providerImage || payload.userImage;

  if (Array.isArray(files) && files.length > 0 && files[0] instanceof File) {
    payload.providerImageUrl = await fileToBase64(files[0]);
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