// Iconos usados en los botones de acciones
import { Pencil, Trash2, Eye } from "lucide-react";
import { IconButton } from "@/shared";
import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";
import {
  showConfirmDeleteAlert,
  showSuccessAlert,
  showCancelAlert,
} from "@/shared/services/alertService";

// Componente que renderiza las acciones de cada fila de platillo
export default function DishRowActions({ dish, onDeleteSuccess }) {
  const navigate = useNavigate();

  // Acción para ver el platillo
  const handleView = () => {
    navigate(`/dashboard/dishes/${dish.id}/view`);
  };

  // Acción para editar el platillo
  const handleEdit = () => {
    navigate(`/dashboard/dishes/${dish.id}/edit`);
  };

  // Acción para eliminar el platillo
  const handleDelete = async () => {
    const nombrePlatillo = dish.nombre || dish.dishName || dish.name || "el platillo";

    const result = await showConfirmDeleteAlert({
      title: "¿Estás seguro?",
      text: `¿Deseas eliminar el platillo "${nombrePlatillo}"?. No podrás revertir esto.`,
    });

    if (result.isConfirmed) {
      // Si recibes un callback para actualizar la lista local/estado
      if (onDeleteSuccess) {
        await onDeleteSuccess(dish.id);
      }

      // Alerta de éxito al eliminar
      await showSuccessAlert({
        title: "¡Eliminado!",
        text: `El platillo "${nombrePlatillo}" fue eliminado con éxito.`,
      });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      // Alerta al cancelar la eliminación
      showCancelAlert({
        title: "Cancelado",
        text: `El platillo "${nombrePlatillo}" no sufrió ningún cambio.`,
      });
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