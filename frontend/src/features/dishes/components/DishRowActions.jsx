import { useNavigate } from "react-router-dom";
import { Eye, Pencil } from "lucide-react";
import { IconButton } from "@/shared";

export default function DishRowActions({ dish }) {
  const navigate = useNavigate();

  const handleView = () => {
    navigate(`/dashboard/dishes/${dish.id}/view`);
  };

  const handleEdit = () => {
    navigate(`/dashboard/dishes/${dish.id}/edit`);
  };

  return (
    <div className="flex items-center gap-2">
      <IconButton
        onClick={handleView}
        title="Ver platillo"
        variant="primary"
        size="sm"
      >
        <Eye className="w-4 h-4" />
      </IconButton>

      <IconButton
        onClick={handleEdit}
        title="Editar platillo"
        variant="primary"
        size="sm"
      >
        <Pencil className="w-4 h-4" />
      </IconButton>
    </div>
  );
}