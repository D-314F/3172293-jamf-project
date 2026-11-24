import { Pencil, Eye } from "lucide-react";
import { IconButton } from "@/shared";
import { useNavigate } from "react-router-dom";

export default function ProviderRowActions({
  provider,
  canView = true,
  canEdit = true,
}) {
  const navigate = useNavigate();

  const handleView = () => {
    navigate(`/dashboard/providerView/${provider.id}`);
  };

  const handleEdit = () => {
    navigate(`/dashboard/providerEdit/${provider.id}`);
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
          title="Ver proveedor"
          variant="primary"
          size="sm"
        >
          <Eye className="w-4 h-4" />
        </IconButton>
      )}

      {canEdit && (
        <IconButton
          onClick={handleEdit}
          title="Editar proveedor"
          variant="primary"
          size="sm"
        >
          <Pencil className="w-4 h-4" />
        </IconButton>
      )}
    </div>
  );
}
