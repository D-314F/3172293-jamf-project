import { API_URL } from "@/features/config";

export const BACKEND_ORIGIN = String(API_URL || "http://localhost:4000/api")
  .replace(/\/api\/?$/i, "")
  .replace(/\/+$/, "");

/**
 * Resuelve cualquier ruta almacenada en PostgreSQL (/uploads/..., http..., data:, blob:)
 * hacia una URL válida consumible desde <img src="..." />.
 */
export function resolveMediaUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== "string") return null;
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;

  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:")
  ) {
    return trimmed;
  }

  return trimmed.startsWith("/")
    ? `${BACKEND_ORIGIN}${trimmed}`
    : `${BACKEND_ORIGIN}/${trimmed}`;
}

/**
 * Sube un archivo físico al backend (POST /api/uploads/:folder) usando multipart/form-data
 * y retorna los metadatos (url, hashName, sizeBytes, mimeType) generados en el servidor.
 */
export async function uploadImage(file, folder = "products") {
  if (!file || !(file instanceof Blob)) {
    throw new Error("Archivo de imagen no válido");
  }

  const token = sessionStorage.getItem("token");
  const body = new FormData();
  body.append("image", file);

  const response = await fetch(`${API_URL}/uploads/${folder}`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Error al subir la imagen al servidor");
  }

  return response.json();
}

/**
 * Helper compartido para extraer el primer File válido de un formulario y subirlo.
 */
export async function resolveUploadedImageUrl(fileInput, folder) {
  const file = Array.isArray(fileInput) ? fileInput[0] : fileInput;
  if (!(file instanceof File)) return null;
  const uploaded = await uploadImage(file, folder);
  return uploaded?.url || uploaded?.fileUrl || null;
}
