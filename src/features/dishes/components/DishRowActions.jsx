// Iconos usados en los botones de acciones
import { Pencil, Trash2, Eye } from "lucide-react";
import { IconButton } from "@/shared";
import { useNavigate } from "react-router-dom";

export default function DishRowActions({ dish }) {
  const navigate = useNavigate();

  // Acción para ver el platillo
  const handleView = () => {
    // 👇 Ajustado a la ruta que tienes en router.jsx
    navigate(`/dashboard/dishes/${dish.id}/view`);
  };

  // Acción para editar el platillo
  const handleEdit = () => {
    navigate(`/dashboard/dishes/${dish.id}/edit`);
  };

  // Acción para eliminar el platillo
  const handleDelete = () => {
    const nombrePlatillo = dish.nombre || dish.dishName || dish.name;

    if (confirm(`¿Estás seguro de que deseas eliminar el platillo ${nombrePlatillo}?`)) {
      alert(`Platillo "${nombrePlatillo}" eliminado con éxito`);
      // Aquí luego puedes integrar la lógica real de eliminación
    }
  };

  return (
    <div className="flex gap-2">
      {/* Botón ver */}
      <IconButton
        onClick={handleView}
        className="bg-[var(--color-brand)] text-[var(--color-text-primary)] hover:bg-[var(--color-brand-hover)] transition"
      >
        <Eye size={16} />
      </IconButton>

      {/* Botón editar */}
      <IconButton
        onClick={handleEdit}
        className="bg-[var(--color-brand)] text-[var(--color-text-primary)] hover:bg-[var(--color-brand-hover)] transition"
      >
        <Pencil size={16} />
      </IconButton>

      {/* Botón eliminar */}
      <IconButton
        onClick={handleDelete}
        className="bg-[var(--color-error)] text-[var(--color-text-inverse)] hover:bg-[var(--color-error-hover)] transition"
      >
        <Trash2 size={16} />
      </IconButton>
    </div>
  );
}
