import { useNavigate } from "react-router-dom";
import { Eye, Pencil } from "lucide-react";
import { IconButton } from "@/shared";

export default function InventoryRowActions({
  item,
  canView = true,
  canEdit = true,
}) {
  const navigate = useNavigate();

  const handleView = () => {
    navigate(`/dashboard/inventory/${item.id}/view`);
  };

  const handleEdit = () => {
    navigate(`/dashboard/inventory/${item.id}/edit`);
  };

  if (!canView && !canEdit) {
    return (
      <span className="text-caption text-[var(--color-text-muted)] italic">
        Sin acciones
      </span>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {canView && (
        <IconButton
          onClick={handleView}
          title="Ver producto"
          variant="primary"
          size="sm"
        >
          <Eye className="w-4 h-4" />
        </IconButton>
      )}

      {canEdit && (
        <IconButton
          onClick={handleEdit}
          title="Editar producto"
          variant="primary"
          size="sm"
        >
          <Pencil className="w-4 h-4" />
        </IconButton>
      )}
    </div>
  );
}
