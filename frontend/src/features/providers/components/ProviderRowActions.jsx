import { Pencil, Trash2, Eye } from "lucide-react";
import { IconButton } from "@/shared";
import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";
import {
  showConfirmDeleteAlert,
  showSuccessAlert,
  showCancelAlert,
} from "@/shared/services/alertService";

export default function ProviderRowActions({ provider, onDeleteSuccess }) {
  const navigate = useNavigate();

  // Acción para ver detalle del proveedor
  const handleView = () => {
    navigate(`/dashboard/providerView/${provider.id}`);
  };

  // Acción para editar el proveedor
  const handleEdit = () => {
    navigate(`/dashboard/providerEdit/${provider.id}`);
  };

  // Acción para eliminar el proveedor
  const handleDelete = async () => {
    const providerName =
      provider.fullName ||
      provider.name ||
      provider.nombre ||
      "el proveedor";

    const result = await showConfirmDeleteAlert({
      title: "¿Estás seguro?",
      text: `¿Deseas eliminar al proveedor "${providerName}"?. No podrás revertir esto.`,
    });

    if (result.isConfirmed) {
      if (onDeleteSuccess) {
        await onDeleteSuccess(provider.id);
      }

      await showSuccessAlert({
        title: "¡Eliminado!",
        text: `El proveedor "${providerName}" fue eliminado con éxito.`,
      });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      showCancelAlert({
        title: "Cancelado",
        text: `El proveedor "${providerName}" no sufrió ningún cambio.`,
      });
    }
  };

  return (
    <div className="flex gap-2">
      {/* Botón ver */}
      <IconButton
        onClick={handleView}
        title="Ver proveedor"
        className="bg-[var(--color-brand)] text-[var(--color-text-primary)] hover:bg-[var(--color-brand-hover)] transition"
      >
        <Eye size={16} />
      </IconButton>

      {/* Botón editar */}
      <IconButton
        onClick={handleEdit}
        title="Editar proveedor"
        className="bg-[var(--color-brand)] text-[var(--color-text-primary)] hover:bg-[var(--color-brand-hover)] transition"
      >
        <Pencil size={16} />
      </IconButton>

      {/* Botón eliminar */}
      <IconButton
        onClick={handleDelete}
        title="Eliminar proveedor"
        className="bg-[var(--color-error)] text-[var(--color-text-inverse)] hover:bg-[var(--color-error-hover)] transition"
      >
        <Trash2 size={16} />
      </IconButton>
    </div>
  );
}