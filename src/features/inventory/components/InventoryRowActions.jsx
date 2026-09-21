import { Pencil, Trash2, Eye } from "lucide-react";
import { IconButton } from "@/shared";
import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";
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
      text: `¿Deseas eliminar "${itemName}" del inventario?. No podrás revertir esto.`,
    });

    if (result.isConfirmed) {
      if (onDeleteSuccess) {
        await onDeleteSuccess(item.id);
      }

      await showSuccessAlert({
        title: "¡Eliminado!",
        text: `El producto "${itemName}" fue eliminado con éxito.`,
      });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      showCancelAlert({
        title: "Cancelado",
        text: `El producto "${itemName}" no sufrió ningún cambio.`,
      });
    }
  };

  return (
    <div className="flex gap-2">
      {/* Botón ver */}
      <IconButton
        onClick={handleView}
        title="Ver producto"
        className="bg-[var(--color-brand)] text-[var(--color-text-primary)] hover:bg-[var(--color-brand-hover)] transition"
      >
        <Eye size={16} />
      </IconButton>

      {/* Botón editar */}
      <IconButton
        onClick={handleEdit}
        title="Editar producto"
        className="bg-[var(--color-brand)] text-[var(--color-text-primary)] hover:bg-[var(--color-brand-hover)] transition"
      >
        <Pencil size={16} />
      </IconButton>

      {/* Botón eliminar */}
      <IconButton
        onClick={handleDelete}
        title="Eliminar producto"
        className="bg-[var(--color-error)] text-[var(--color-text-inverse)] hover:bg-[var(--color-error-hover)] transition"
      >
        <Trash2 size={16} />
      </IconButton>
    </div>
  );
}