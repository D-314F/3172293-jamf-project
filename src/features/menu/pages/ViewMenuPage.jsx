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

      {/* Tarjetas del menú */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
        {menuData.map((item, index) => (
          <div
            className={`rounded-2xl overflow-hidden shadow-lg w-80 transition-all bg-[var(--color-background-inverse)] text-[var(--color-text-inverse)]`}
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-[var(--text-subtitle)] font-[var(--font-heading)] mb-1">
                {item.title}
              </h2>
              <p className="text-[var(--color-text-secondary)] text-[var(--text-body)] mb-3">
                {item.description}
              </p>
              <div className="border-t border-[var(--color-border)] pt-2 flex justify-between items-center">
              </div>

              {/* Estado individual */}
              <div className="flex items-center justify-between mt-4">
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
        ))}
      </div>
    </div>
  );
}
