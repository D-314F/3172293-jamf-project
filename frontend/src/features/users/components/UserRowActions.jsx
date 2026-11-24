import { Pencil, Eye } from "lucide-react";
import { IconButton } from "@/shared";
import { useNavigate } from "react-router-dom";

export default function UserRowActions({
  user,
  canView = true,
  canEdit = true,
}) {
  const navigate = useNavigate();

  const handleView = () => {
    navigate(`/dashboard/userview/${user?.id}`);
  };

  const handleEdit = () => {
    navigate(`/dashboard/userEdit/${user?.id}`);
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
          title="Ver usuario"
          variant="primary"
          size="sm"
        >
          <Eye className="w-4 h-4" />
        </IconButton>
      )}

      {canEdit && (
        <IconButton
          onClick={handleEdit}
          title="Editar usuario"
          variant="primary"
          size="sm"
        >
          <Pencil className="w-4 h-4" />
        </IconButton>
      )}
    </div>
  );
}
