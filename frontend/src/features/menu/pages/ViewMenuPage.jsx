import { useState } from "react";
import { menuData } from "../data/menuData";
import StatusSwitch from "@/shared/components/StatusSwitch";

export default function ViewMenuPage() {
  const [categoria, setCategoria] = useState("Entradas");
  // Estado independiente para cada card
  const [estados, setEstados] = useState(
    menuData.map(() => true) // todas activas al inicio
  );

  // Función para cambiar el estado de una card específica
  const toggleEstado = (index, value) => {
    const nuevosEstados = [...estados];
    nuevosEstados[index] = value;
    setEstados(nuevosEstados);
  };

  return (
    <div className="min-h-screen bg-[var(--color-background-inverse)] text-[var(--color-text-inverse)] p-10">
      <h1 className="text-4xl font-bold text-center mb-8 text-[var(--text-main)] font-[var(--font-heading)]">
        Nuestro Menú
      </h1>

      {/* Selector de categoría */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <label className="text-[var(--text-body)] font-[var(--font-heading)]">
          Categoría:
        </label>
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="bg-[var(--color-background)] text-[var(--color-text-primary)] px-3 py-2 rounded-lg"
        >
          <option>Entradas</option>
          <option>Platos fuertes</option>
          <option>Ensaladas</option>
          <option>Postres</option>
          <option>Bebidas</option>
        </select>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        {menuData.map((item, index) => (
          <div
            key={index}
            
            className="h-full flex flex-col rounded-2xl overflow-hidden shadow-lg transition-all bg-[var(--color-background-inverse)] border border-gray-800 text-[var(--color-text-inverse)]"
          >
            <div className="h-48 w-full overflow-hidden relative">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-5 flex flex-col flex-1 justify-between">
              <div>
                <h2 className="text-[var(--text-subtitle)] font-[var(--font-heading)] mb-1 truncate">
                  {item.title}
                </h2>
                {/* limita la descripción a 2 líneas y reserva espacio uniforme. */}
                <p className="text-[var(--color-text-secondary)] text-[var(--text-body)] mb-3 line-clamp-2 min-h-[2.5rem]">
                  {item.description}
                </p>
              </div>

              <div>
                <div className="border-t border-[var(--color-border)] pt-2 flex justify-between items-center mb-2">
                  <span className="text-xs uppercase tracking-wider text-gray-400">Precio</span>
                  <span className="text-amber-400 font-bold">${item.price || "10.000"}</span>
                </div>

                {/* Estado individual */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-800/60">
                  <span className="text-[var(--text-body)] font-[var(--font-heading)]">
                    Estado: {estados[index] ? "Activo" : "Inactivo"}
                  </span>
                  <StatusSwitch
                    checked={estados[index]}
                    onChange={(value) => toggleEstado(index, value)}
                    size="sm"
                  />
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}