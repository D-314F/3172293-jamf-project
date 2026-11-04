// frontend/src/features/menu/services/menuService.js

// Importamos las imágenes locales de la carpeta assets/images/ exactamente como las acomodaste
import bf5 from "@/assets/images/bf-5.png";
import bf6 from "@/assets/images/bf-6.png";
import bf7 from "@/assets/images/bf-7.png";
import bf8 from "@/assets/images/bf-8.png";
import bf9 from "@/assets/images/bf-9.png";
import bf10 from "@/assets/images/bf-10.png";
import bf11 from "@/assets/images/bf-11.png";
import bf12 from "@/assets/images/bf-12.png";

// Los 8 platillos oficiales basados en tu estructura exacta
const MOCK_MENU = [
  {
    id: "1",
    title: "Entradas Refinadas",
    description: "Pequeñas delicias para abrir el apetito.",
    price: 10000,
    category: "Entradas",
    imageUrl: bf5,
    isActive: true,
  },
  {
    id: "2",
    title: "Principales Magníficos",
    description: "Platos fuertes con sabor único.",
    price: 25000,
    category: "Platos fuertes",
    imageUrl: bf6,
    isActive: true,
  },
  {
    id: "3",
    title: "Carpaccio de Pulpo",
    description: "Delicadas láminas de pulpo con frescura marina.",
    price: 30000,
    category: "Entradas",
    imageUrl: bf7,
    isActive: true,
  },
  {
    id: "4",
    title: "Torta Atún Rojo",
    description: "Fresco atún sobre mezcla de hojas y vinagreta de soya.",
    price: 16500,
    category: "Entradas",
    imageUrl: bf8,
    isActive: true,
  },
  {
    id: "5",
    title: "Risotto de Hongos",
    description: "Arroz cremoso con setas frescas y parmesano.",
    price: 28000,
    category: "Platos fuertes",
    imageUrl: bf9,
    isActive: true,
  },
  {
    id: "6",
    title: "Bruschetta Mediterránea",
    description: "Pan tostado con tomate, albahaca y aceite de oliva.",
    price: 12000,
    category: "Entradas",
    imageUrl: bf10,
    isActive: true,
  },
  {
    id: "7",
    title: "Limonada de Coco Frutal",
    description: "Refrescante combinación de limón y crema de coco natural.",
    price: 8500,
    category: "Bebidas",
    imageUrl: bf11,
    isActive: true,
  },
  {
    id: "8",
    title: "Cocktail Mojito Artesanal",
    description: "Clásico trago con hierbabuena fresca, limones y soda.",
    price: 15000,
    category: "Bebidas",
    imageUrl: bf12,
    isActive: true,
  },
];

// Función para obtener el menú simulado desde el servicio
export async function getMenu() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_MENU);
    }, 100);
  });
}

// Obtener platillo por ID
export async function getDishById(id) {
  return new Promise((resolve, reject) => {
    const dish = MOCK_MENU.find((item) => item.id === id);
    if (dish) resolve(dish);
    else reject(new Error("Platillo no encontrado"));
  });
}

// Actualización estática simulada
export async function updateDishStatus(id, isActive) {
  return new Promise((resolve) => {
    const dish = MOCK_MENU.find((item) => item.id === id);
    if (dish) {
      dish.isActive = isActive;
    }
    resolve({ success: true, isActive });
  });
}