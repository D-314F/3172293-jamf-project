// src/features/inventory/components/InventoryRowActions.jsx

import { useNavigate } from "react-router-dom";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { IconButton } from "@/shared";
import {
  showConfirmDeleteAlert,
  showSuccessAlert,
  showCancelAlert,
} from "@/shared/services/alertService";

export default function InventoryRowActions({ item, onDeleteSuccess }) {
  const navigate = useNavigate();

  // Acción para ver el ítem de inventario
  const handleView = () => {
    navigate(`/dashboard/inventory/${item.id}/view`);
  };

  // Acción para editar el ítem de inventario
  const handleEdit = () => {
    navigate(`/dashboard/inventory/${item.id}/edit`);
  };

  // Acción para eliminar el producto del inventario
  const handleDelete = async () => {
    const itemName = item.name || item.nombre || item.productName || "el producto";

    const result = await showConfirmDeleteAlert({
      title: "¿Estás seguro?",
      text: `¿Deseas eliminar "${itemName}" del inventario? No podrás revertir esta acción.`,
    });

    if (result.isConfirmed) {
      if (onDeleteSuccess) {
        await onDeleteSuccess(item.id);
      }

      await showSuccessAlert({
        title: "¡Eliminado!",
        text: `El producto "${itemName}" fue eliminado con éxito.`,
      });
    } else if (result.isDismissed) {
      showCancelAlert({
        title: "Cancelado",
        text: `El producto "${itemName}" no sufrió ningún cambio.`,
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Botón ver */}
      <IconButton
        onClick={handleView}
        title="Ver producto"
        variant="primary"
        size="sm"
      >
        <Eye className="w-4 h-4" />
      </IconButton>

      {/* Botón editar */}
      <IconButton
        onClick={handleEdit}
        title="Editar producto"
        variant="primary"
        size="sm"
      >
        <Pencil className="w-4 h-4" />
      </IconButton>

      {/* Botón eliminar */}
      <IconButton
        onClick={handleDelete}
        title="Eliminar producto"
        variant="danger"
        size="sm"
      >
        <Trash2 className="w-4 h-4" />
      </IconButton>
    </div>
  );
}