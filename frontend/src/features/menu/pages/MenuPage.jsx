import { useState, useEffect } from "react";
import { menuService } from "../services/menuService";
import StatusSwitch from "@/shared/components/StatusSwitch";

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [categoria, setCategoria] = useState("Todas");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar platillos reales al montar el componente
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const data = await menuService.getMenu();
        setMenuItems(data);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar el menú. Intenta de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  // Función para cambiar el estado en el backend y reflejarlo en la UI
  const toggleEstado = async (id, currentStatus) => {
    const nuevoEstado = !currentStatus;
    
    try {
      // Actualizamos en el backend
      await menuService.updateStatus(id, nuevoEstado);

      // Actualizamos el estado localmente si la petición fue exitosa
      setMenuItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id ? { ...item, is_active: nuevoEstado } : item
        )
      );
    } catch (err) {
      console.error("No se pudo cambiar el estado", err);
    }
  };

  // Filtrado por categoría
  const platillosFiltrados = menuItems.filter((item) => {
    if (categoria === "Todas") return true;
    return item.category === categoria;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-amber-400 font-bold text-xl">
        Cargando menú desde la base de datos...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 font-bold text-xl">
        {error}
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-[var(--color-background-inverse)] text-[var(--color-text-inverse)] p-10">
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

      {/* Cuadrícula de platillos */}
      {platillosFiltrados.length === 0 ? (
        <p className="text-center text-gray-400 text-lg">
          No hay platillos disponibles en esta categoría.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
          {platillosFiltrados.map((item) => (
            <div
              key={item.id}
              className="h-full flex flex-col rounded-2xl overflow-hidden shadow-lg transition-all bg-[var(--color-background-inverse)] border border-gray-800 text-[var(--color-text-inverse)]"
            >
              <div className="h-48 w-full overflow-hidden relative">
                <img
                  src={item.image_url || "/placeholder-dish.jpg"}
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
                    <span className="text-xs uppercase tracking-wider text-gray-400">Precio</span>
                    <span className="text-amber-400 font-bold text-base">
                      ${Number(item.price).toLocaleString("es-CO")}
                    </span>
                  </div>

                  {/* Estado individual con StatusSwitch conectado a PostgreSQL */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-800/60">
                    <span className="text-sm font-medium">
                      Estado:{" "}
                      <span className={item.is_active ? "text-green-400" : "text-red-400"}>
                        {item.is_active ? "Activo" : "Inactivo"}
                      </span>
                    </span>
                    <StatusSwitch
                      checked={item.is_active}
                      onChange={() => toggleEstado(item.id, item.is_active)}
                      size="sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}