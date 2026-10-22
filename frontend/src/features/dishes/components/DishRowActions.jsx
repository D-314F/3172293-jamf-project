// src/features/menu/components/DishRowActions.jsx

import { useNavigate } from "react-router-dom";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { IconButton } from "@/shared";
import {
  showConfirmDeleteAlert,
  showSuccessAlert,
  showCancelAlert,
} from "@/shared/services/alertService";

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
      text: `¿Deseas eliminar el platillo "${nombrePlatillo}"? No podrás revertir esta acción.`,
    });

    if (result.isConfirmed) {
      if (onDeleteSuccess) {
        await onDeleteSuccess(dish.id);
      }

      await showSuccessAlert({
        title: "¡Eliminado!",
        text: `El platillo "${nombrePlatillo}" fue eliminado con éxito.`,
      });
    } else if (result.isDismissed) {
      showCancelAlert({
        title: "Cancelado",
        text: `El platillo "${nombrePlatillo}" no sufrió ningún cambio.`,
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Botón ver */}
      <IconButton
        onClick={handleView}
        title="Ver platillo"
        variant="primary"
        size="sm"
      >
        <Eye className="w-4 h-4" />
      </IconButton>

      {/* Botón editar */}
      <IconButton
        onClick={handleEdit}
        title="Editar platillo"
        variant="primary"
        size="sm"
      >
        <Pencil className="w-4 h-4" />
      </IconButton>

      {/* Botón eliminar */}
      <IconButton
        onClick={handleDelete}
        title="Eliminar platillo"
        variant="danger"
        size="sm"
      >
        <Trash2 className="w-4 h-4" />
      </IconButton>
    </div>
  );
}
