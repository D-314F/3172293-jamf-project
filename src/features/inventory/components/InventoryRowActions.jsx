// src/features/inventory/components/InventoryRowActions.jsx
import { Pencil, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function InventoryRowActions({ item }) {
  const navigate = useNavigate();

  const handleView = () => {
  navigate(`/dashboard/inventory/${item.id}/view`);
};

const handleEdit = () => {
  navigate(`/dashboard/inventory/${item.id}/edit`);
};


  // Acción para eliminar el producto
  const handleDelete = () => {
    console.log("Eliminar producto del inventario", item.id);
  };

  return (
    <div className="flex gap-2">
      {/* Botón ver */}
      <button
        onClick={handleView}
        className="p-1 rounded hover:bg-[var(--color-surface-muted)] transition-colors duration-200"
        title="Ver producto"
      >
        <Eye size={16} color="var(--color-text-primary)" />
      </button>

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
