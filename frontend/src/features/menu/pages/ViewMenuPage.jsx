// frontend/src/features/menu/pages/ViewMenuPage.jsx
import { useState, useEffect } from "react";
import StatusSwitch from "@/shared/components/StatusSwitch";

// Importamos las imágenes locales desde la carpeta assets/images/
import bf5 from "@/assets/images/bf-5.png";
import bf6 from "@/assets/images/bf-6.png";
import bf7 from "@/assets/images/bf-7.png";
import bf8 from "@/assets/images/bf-8.png";
import bf9 from "@/assets/images/bf-9.png";
import bf10 from "@/assets/images/bf-10.png";
import bf11 from "@/assets/images/bf-11.png"
import bf12 from "@/assets/images/bf-12.png"

export default function ViewMenuPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [categoria, setCategoria] = useState("Todas");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        // Los 8 platillos enlazados con las imágenes locales de su proyecto
        const data = [
          {
            id: "1",
            title: "Entradas Refinadas",
            description: "Pequeñas delicias para abrir el apetito.",
            price: 10000,
            category: "Entradas",
            imageUrl: bf5,
          },
          {
            id: "2",
            title: "Principales Magníficos",
            description: "Platos fuertes con sabor único.",
            price: 25000,
            category: "Platos fuertes",
            imageUrl: bf6,
          },
          {
            id: "3",
            title: "Carpaccio de Pulpo",
            description: "Delicadas láminas de pulpo con frescura marina.",
            price: 30000,
            category: "Entradas",
            imageUrl: bf7,
          },
          {
            id: "4",
            title: "Torta Atún Rojo",
            description: "Fresco atún sobre mezcla de hojas y vinagreta de soya.",
            price: 16500,
            category: "Entradas",
            imageUrl: bf8,
          },
          {
            id: "5",
            title: "Risotto de Hongos",
            description: "Arroz cremoso con setas frescas y parmesano.",
            price: 28000,
            category: "Platos fuertes",
            imageUrl: bf9,
          },
          {
            id: "6",
            title: "Bruschetta Mediterránea",
            description: "Pan tostado con tomate, albahaca y aceite de oliva.",
            price: 12000,
            category: "Entradas",
            imageUrl: bf10,
          },
          {
            id: "7",
            title: "Limonada de Coco Frutal",
            description: "Refrescante combinación de limón y crema de coco natural.",
            price: 8500,
            category: "Bebidas",
            imageUrl: bf11,
          },
          {
            id: "8",
            title: "Cocktail Mojito Artesanal",
            description: "Clásico trago con hierbabuena fresca, limones y soda.",
            price: 15000,
            category: "Bebidas",
            imageUrl: bf12,
          },
        ];
        setMenuItems(data);
      } catch (err) {
        console.error("Error al cargar el menú:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  // Filtrado por categoría desde el select
  const platillosFiltrados = menuItems.filter((item) => {
    if (categoria === "Todas") return true;
    return item.category === categoria;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-amber-400 font-bold text-xl">
        Cargando menú...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background-inverse)] text-[var(--color-text-inverse)] p-10">
      <h1 className="text-4xl font-bold text-center mb-6 text-[var(--text-main)] font-[var(--font-heading)]">
        Nuestro Menú
      </h1>

      {/* Selector de categoría */}
      <div className="flex items-center justify-center gap-3 mb-10">
        <label className="text-[var(--text-body)] font-[var(--font-heading)] font-semibold">
          Categoría:
        </label>
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="bg-[var(--color-background)] text-[var(--color-text-primary)] px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-amber-400"
        >
          <option value="Todas">Todas las categorías</option>
          <option value="Entradas">Entradas</option>
          <option value="Platos fuertes">Platos fuertes</option>
          <option value="Ensaladas">Ensaladas</option>
          <option value="Postres">Postres</option>
          <option value="Bebidas">Bebidas</option>
        </select>
      </div>

      {/* Grid de Platillos */}
      {platillosFiltrados.length === 0 ? (
        <p className="text-center text-gray-400 text-lg">
          No hay platillos disponibles en esta categoría.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
          {platillosFiltrados.map((item) => (
            <div
              key={item.id}
              className="h-full flex flex-col rounded-2xl overflow-hidden shadow-lg bg-[var(--color-background-inverse)] border border-gray-800 text-[var(--color-text-inverse)]"
            >
              <div className="h-48 w-full overflow-hidden relative">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-5 flex flex-col flex-1 justify-between">
                <div>
                  <h2 className="text-[var(--text-subtitle)] font-[var(--font-heading)] mb-1 truncate font-bold text-lg">
                    {item.title}
                  </h2>
                  <p className="text-[var(--color-text-secondary)] text-sm mb-3 line-clamp-2 min-h-[2.5rem]">
                    {item.description}
                  </p>
                </div>

                <div>
                  <div className="border-t border-[var(--color-border)] pt-2 flex justify-between items-center mb-3">
                    <span className="text-xs uppercase tracking-wider text-gray-400">PRECIO</span>
                    <span className="text-amber-400 font-bold text-base">
                      ${item.price.toLocaleString("es-CO")}
                    </span>
                  </div>

                  {/* Estado estático en Activo / Disponible con switch deshabilitado */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-800/60">
                    <span className="text-sm font-medium">
                      Estado: <span className="text-green-400 font-semibold">Activo</span>
                    </span>
                    <StatusSwitch
                      checked={true}
                      disabled={true}
                      size="sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}