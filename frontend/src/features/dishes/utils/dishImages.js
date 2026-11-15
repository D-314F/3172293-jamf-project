// Reemplaza todo: frontend/src/features/dishes/utils/dishImages.js
import bf5 from "@/assets/images/bf-5.png";
import bf6 from "@/assets/images/bf-6.png";
import bf7 from "@/assets/images/bf-7.png";
import bf8 from "@/assets/images/bf-8.png";
import bf9 from "@/assets/images/bf-9.png";
import bf10 from "@/assets/images/bf-10.png";
import bf11 from "@/assets/images/bf-11.png";
import bf12 from "@/assets/images/bf-12.png";
import bf13 from "@/assets/images/bf-13.png";
import bf14 from "@/assets/images/bf-14.png";
import bf15 from "@/assets/images/bf-15.png";
import bf16 from "@/assets/images/bf-16.png";
import bf17 from "@/assets/images/bf-17.png";
import bf18 from "@/assets/images/bf-18.png";
import home1 from "@/assets/images/home-1.png";

const DISH_NAME_IMAGES = {
  "torta atún rojo": bf8,
  "torta atun rojo": bf8,
  "carpaccio de res trufado": bf13,
  "magret de pato": bf9,
  "bistec turco": bf7,
  "salmón noruego": bf6,
  "salmon noruego": bf6,
  "roulade de ave": bf5,
  "pechuga a la naranja": bf10,
  "bandeja especial jamf": home1,
  "ensalada césar de la casa": bf14,
  "ensalada cesar de la casa": bf14,
  "ensalada mediterránea tibia": bf15,
  "ensalada mediterranea tibia": bf15,
  "souffle grand marmier": bf17,
  "soufflé grand marnier": bf17,
  "pavlova de frutos rojos": bf18,
  "limonada de frutos rojos y menta": bf16,
};

const CATEGORY_FALLBACKS = {
  entradas: bf8,
  "platos fuertes": bf6,
  platos_fuertes: bf6,
  ensaladas: bf14,
  postres: bf17,
  bebidas: bf16,
};

const GALLERY_POOL = [
  bf5,
  bf6,
  bf7,
  bf8,
  bf9,
  bf10,
  bf11,
  bf12,
  bf13,
  bf14,
  bf15,
  bf16,
  bf17,
  bf18,
  home1,
];

export function resolveDishImage(dish = {}) {
  const explicitUrl =
    dish.dishImageUrl || dish.imageUrl || dish.image_url || dish.imagen;
  if (
    typeof explicitUrl === "string" &&
    (explicitUrl.startsWith("data:image") || explicitUrl.startsWith("http"))
  ) {
    return explicitUrl;
  }

  const rawName = (dish.dishName || dish.nombre || dish.name || "")
    .trim()
    .toLowerCase();
  if (rawName && DISH_NAME_IMAGES[rawName]) {
    return DISH_NAME_IMAGES[rawName];
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
    return CATEGORY_FALLBACKS[rawCategory];
  }

  const numericId = Number(dish.id) || 0;
  return GALLERY_POOL[numericId % GALLERY_POOL.length];
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