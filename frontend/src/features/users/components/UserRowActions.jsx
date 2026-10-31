import { Pencil, Eye } from "lucide-react";
import { IconButton } from "@/shared";
import { useNavigate } from "react-router-dom";

export default function UserRowActions({ user }) {
  const navigate = useNavigate();

  const handleView = () => {
    navigate(`/dashboard/userview/${user?.id}`);
  };

  const handleEdit = () => {
    navigate(`/dashboard/userEdit/${user?.id}`);
  };

  return (
    <div className="flex items-center gap-2">
      <IconButton
        onClick={handleView}
        title="Ver usuario"
        variant="primary"
        size="sm"
      >
        <Eye className="w-4 h-4" />
      </IconButton>

      <IconButton
        onClick={handleEdit}
        title="Editar usuario"
        variant="primary"
        size="sm"
      >
        <Pencil className="w-4 h-4" />
      </IconButton>
    </div>
  );
}