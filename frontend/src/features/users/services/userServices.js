import { API_URL } from "@/features/config";

const USERS_URL = `${API_URL}/users`;

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

// Obtener todos los usuarios (GET /api/users)
export async function getUsers() {
  const token = sessionStorage.getItem("token");

  const response = await fetch(USERS_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Error al obtener la lista de usuarios");
  }

  return response.json();
}

// Obtener un usuario por su ID (GET /api/users/:id)
export async function getUserById(id) {
  const token = sessionStorage.getItem("token");

  const response = await fetch(`${USERS_URL}/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error al obtener los datos del usuario");
  }

  return response.json();
}

// Actualizar un usuario (PUT /api/users/:id)
export async function updateUser(id, userData) {
  const token = sessionStorage.getItem("token");

  const rawFile = Array.isArray(userData.userImage) ? userData.userImage[0] : null;
  const base64Avatar = rawFile ? await fileToDataUrl(rawFile) : null;

  const payload = {
    ...userData,
    ...(base64Avatar ? { userAvatarUrl: base64Avatar } : {}),
  };

  const response = await fetch(`${USERS_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Error al actualizar el usuario");
  }

  return response.json();
}

// Crear un nuevo usuario (POST /api/users)
export async function createUser(userData) {
  const token = sessionStorage.getItem("token");

  const rawFile = Array.isArray(userData.userImage) ? userData.userImage[0] : null;
  const base64Avatar = rawFile ? await fileToDataUrl(rawFile) : null;

  const payload = {
    ...userData,
    ...(base64Avatar ? { userAvatarUrl: base64Avatar } : {}),
  };

  const response = await fetch(USERS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Error al crear usuario");
  }

  return response.json();
}