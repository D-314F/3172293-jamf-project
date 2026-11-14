import bf5 from "@/assets/images/bf-5.png";
import bf6 from "@/assets/images/bf-6.png";
import bf7 from "@/assets/images/bf-7.png";
import bf8 from "@/assets/images/bf-8.png";
import bf9 from "@/assets/images/bf-9.png";
import bf10 from "@/assets/images/bf-10.png";
import bf11 from "@/assets/images/bf-11.png";
import bf12 from "@/assets/images/bf-12.png";
import home1 from "@/assets/images/home-1.png";

// Detecta automáticamente si agregas bf-13, bf-14, bf-15, bf-16 (.png, .jpg, .webp)
const dynamicAssets = import.meta.glob(
  "@/assets/images/bf-*.{png,jpg,jpeg,webp}",
  { eager: true, import: "default" }
);

function findAsset(prefix) {
  const matchKey = Object.keys(dynamicAssets).find((key) =>
    new RegExp(`/${prefix}\\.(png|jpg|jpeg|webp)$`, "i").test(key)
  );
  return matchKey ? dynamicAssets[matchKey] : null;
}

const bf13 = findAsset("bf-13") || bf5;
const bf14 = findAsset("bf-14") || bf9;
const bf15 = findAsset("bf-15") || bf8;
const bf16 = findAsset("bf-16") || bf12;

const DISH_NAME_IMAGES = {
  "torta atún rojo": bf5,
  "torta atun rojo": bf5,
  "carpaccio de res trufado": bf13,
  "magret de pato": bf6,
  "bistec turco": bf7,
  "salmón noruego": bf8,
  "salmon noruego": bf8,
  "roulade de ave": bf9,
  "pechuga a la naranja": bf10,
  "bandeja especial jamf": home1,
  "ensalada césar de la casa": bf14,
  "ensalada cesar de la casa": bf14,
  "ensalada mediterránea tibia": bf15,
  "ensalada mediterranea tibia": bf15,
  "souffle grand marmier": bf11,
  "pavlova de frutos rojos": bf12,
  "limonada de frutos rojos y menta": bf16,
};

const CATEGORY_FALLBACKS = {
  entradas: bf5,
  "platos fuertes": bf7,
  platos_fuertes: bf7,
  ensaladas: bf14,
  postres: bf11,
  bebidas: bf16,
};

const GALLERY_POOL = [bf5, bf6, bf7, bf8, bf9, bf10, bf11, bf12, home1];

export function resolveDishImage(dish = {}) {
  const explicitUrl = dish.dishImageUrl || dish.imagen || dish.image;
  if (explicitUrl && typeof explicitUrl === "string" && explicitUrl.trim() !== "") {
    return explicitUrl;
  }

  const rawName = (dish.dishName || dish.nombre || dish.name || "").trim().toLowerCase();
  if (rawName && DISH_NAME_IMAGES[rawName]) {
    return DISH_NAME_IMAGES[rawName];
  }

  const rawCategory = (dish.dishCategory || dish.category || dish.categoria || "")
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