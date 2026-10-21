import { Pencil, Trash2, Eye } from "lucide-react";
import { IconButton } from "@/shared";
import { useNavigate } from "react-router-dom";
import { handleCancelOrderProcess } from "./CancelOrderModal";

export default function OrderRowActions({ order }) {
  const navigate = useNavigate();

  const handleEdit = () => navigate(`/dashboard/orders/edit/${order.id}`);
  const handleView = () => navigate(`/dashboard/orders/detail/${order.id}`);

  const handleDelete = () => {
    handleCancelOrderProcess(order, (orderId) => {
      console.log("Orden cancelada en BD/Estado:", orderId);
    });
  };

  return (
    <div className="flex items-center gap-2 justify-end">
      <IconButton 
        onClick={handleView} 
        variant="primary"
        title="Ver detalle"
      >
        <Eye size={16} />
      </IconButton>

      <IconButton 
        onClick={handleEdit} 
        variant="primary"
        title="Editar orden"
      >
        <Pencil size={16} />
      </IconButton>

      <IconButton 
        onClick={handleDelete} 
        variant="danger"
        title="Cancelar orden"
      >
        <Trash2 size={16} />
      </IconButton>
    </div>
  );
}