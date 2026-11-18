import { BACKEND_ORIGIN, resolveMediaUrl } from "@/shared/services/uploadService";

const PRODUCT_UPLOAD_BASE = `${BACKEND_ORIGIN}/uploads/products`;

const DISH_NAME_IMAGES = {
  "torta atún rojo": "bf-8.png",
  "torta atun rojo": "bf-8.png",
  "carpaccio de res trufado": "bf-13.png",
  "magret de pato": "bf-9.png",
  "bistec turco": "bf-7.png",
  "salmón noruego": "bf-6.png",
  "salmon noruego": "bf-6.png",
  "roulade de ave": "bf-5.png",
  "pechuga a la naranja": "bf-10.png",
  "bandeja especial jamf": "home-1.png",
  "ensalada césar de la casa": "bf-14.png",
  "ensalada cesar de la casa": "bf-14.png",
  "ensalada mediterránea tibia": "bf-15.png",
  "ensalada mediterranea tibia": "bf-15.png",
  "souffle grand marmier": "bf-17.png",
  "soufflé grand marnier": "bf-17.png",
  "pavlova de frutos rojos": "bf-18.png",
  "limonada de frutos rojos y menta": "bf-16.png",
};

const CATEGORY_FALLBACKS = {
  entradas: "bf-8.png",
  "platos fuertes": "bf-6.png",
  platos_fuertes: "bf-6.png",
  ensaladas: "bf-14.png",
  postres: "bf-17.png",
  bebidas: "bf-16.png",
};

const GALLERY_POOL = [
  "bf-5.png",
  "bf-6.png",
  "bf-7.png",
  "bf-8.png",
  "bf-9.png",
  "bf-10.png",
  "bf-11.png",
  "bf-12.png",
  "bf-13.png",
  "bf-14.png",
  "bf-15.png",
  "bf-16.png",
  "bf-17.png",
  "bf-18.png",
  "home-1.png",
];

/**
 * Resuelve la URL de la imagen desde el backend (nunca desde assets del frontend).
 */
export function resolveDishImage(dish = {}) {
  const explicitUrl =
    dish.dishImageUrl || dish.imageUrl || dish.image_url || dish.imagen;

  const resolvedExplicit = resolveMediaUrl(explicitUrl);
  if (resolvedExplicit) {
    return resolvedExplicit;
  }

  const rawName = (dish.dishName || dish.nombre || dish.name || "")
    .trim()
    .toLowerCase();
  if (rawName && DISH_NAME_IMAGES[rawName]) {
    return `${PRODUCT_UPLOAD_BASE}/${DISH_NAME_IMAGES[rawName]}`;
  }

  const rawCategory = (
    dish.dishCategory ||
    dish.category ||
    dish.categoria ||
    ""
  )
    .trim()
    .toLowerCase();
  if (rawCategory && CATEGORY_FALLBACKS[rawCategory]) {
    return `${PRODUCT_UPLOAD_BASE}/${CATEGORY_FALLBACKS[rawCategory]}`;
  }

  const numericId = Number(dish.id) || 0;
  return `${PRODUCT_UPLOAD_BASE}/${GALLERY_POOL[numericId % GALLERY_POOL.length]}`;
}

export function normalizeCategoryLabel(rawCategory = "") {
  const map = {
    entradas: "Entradas",
    platos_fuertes: "Platos Fuertes",
    "platos fuertes": "Platos Fuertes",
    ensaladas: "Ensaladas",
    postres: "Postres",
    bebidas: "Bebidas",
  };
  const key = String(rawCategory || "").trim().toLowerCase();
  return map[key] || rawCategory || "Platos Fuertes";
}

export function formatCopPrice(value) {
  const num = Number(value) || 0;
  return `$ ${num.toLocaleString("es-CO")}`;
}
