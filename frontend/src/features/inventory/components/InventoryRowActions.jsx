import { useNavigate } from "react-router-dom";
import { Eye, Pencil } from "lucide-react";
import { IconButton } from "@/shared";

export default function InventoryRowActions({ item }) {
  const navigate = useNavigate();

  const handleView = () => {
    navigate(`/dashboard/inventory/${item.id}/view`);
  };

  const handleEdit = () => {
    navigate(`/dashboard/inventory/${item.id}/edit`);
  };

  return (
    <div className="flex items-center gap-2">
      <IconButton
        onClick={handleView}
        title="Ver producto"
        variant="primary"
        size="sm"
      >
        <Eye className="w-4 h-4" />
      </IconButton>

      <IconButton
        onClick={handleEdit}
        title="Editar producto"
        variant="primary"
        size="sm"
      >
        <Pencil className="w-4 h-4" />
      </IconButton>
    </div>
  );
}