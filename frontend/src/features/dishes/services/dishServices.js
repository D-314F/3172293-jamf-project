import { API_URL } from "@/features/config";

const DISHES_URL = `${API_URL}/dishes`;

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (!file || !(file instanceof Blob)) {
      resolve(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

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

  const rawFile = Array.isArray(dishData.dishImage)
    ? dishData.dishImage[0]
    : Array.isArray(dishData.userImage)
    ? dishData.userImage[0]
    : null;

  const base64Image = rawFile ? await fileToDataUrl(rawFile) : null;

  const payload = {
    ...dishData,
    ...(base64Image ? { dishImageUrl: base64Image } : {}),
  };

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

  const rawFile = Array.isArray(dishData.userImage)
    ? dishData.userImage[0]
    : Array.isArray(dishData.dishImage)
    ? dishData.dishImage[0]
    : null;

  const base64Image = rawFile ? await fileToDataUrl(rawFile) : null;

  const payload = {
    ...dishData,
    ...(base64Image ? { dishImageUrl: base64Image } : {}),
  };

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