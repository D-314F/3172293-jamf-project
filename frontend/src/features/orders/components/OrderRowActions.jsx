import { Pencil, Eye } from "lucide-react";
import { IconButton } from "@/shared";
import { useNavigate } from "react-router-dom";

export default function OrderRowActions({ order }) {
  const navigate = useNavigate();

  const handleView = () => navigate(`/dashboard/orders/detail/${order.id}`);
  const handleEdit = () => navigate(`/dashboard/orders/edit/${order.id}`);

  return (
    <div className="flex items-center gap-2">
      <IconButton
        onClick={handleView}
        variant="primary"
        size="sm"
        title="Ver detalle"
      >
        <Eye className="w-4 h-4" />
      </IconButton>

      <IconButton
        onClick={handleEdit}
        variant="primary"
        size="sm"
        title="Editar orden"
      >
        <Pencil className="w-4 h-4" />
      </IconButton>
    </div>
  );
}