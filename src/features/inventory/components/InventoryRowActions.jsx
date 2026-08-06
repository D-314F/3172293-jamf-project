// src/features/inventory/components/InventoryRowActions.jsx

// Iconos usados en los botones de acciones
import { Pencil, Trash2 } from "lucide-react";

// Hook de React Router para navegar programáticamente entre rutas
import { useNavigate } from "react-router-dom";

// Componente que renderiza las acciones de cada fila de inventario
// Recibe como prop el objeto item (producto del inventario)
export default function InventoryRowActions({ item }) {
  const navigate = useNavigate();

  // Acción para editar el producto del inventario
  const handleEdit = () => {
    navigate(`/inventory/${item.id}/edit`);
  };

  // Acción para eliminar el producto del inventario
  const handleDelete = () => {
    console.log("Eliminar producto del inventario", item.id);
  };

  return (
    // Contenedor de los botones de acciones
    <div className="flex gap-2">
      {/* Botón editar */}
      <button
        onClick={handleEdit}
        className="p-1 rounded hover:bg-[var(--color-surface-muted)] transition-colors duration-200"
        title="Editar producto"
      >
        <Pencil size={16} color="var(--color-text-primary)" />
      </button>

      {/* Botón eliminar */}
      <button
        onClick={handleDelete}
        className="p-1 rounded hover:bg-[var(--color-error-soft)] transition-colors duration-200"
        title="Eliminar producto"
      >
        <Trash2 size={16} color="var(--color-error)" />
      </button>
    </div>
  );
}
