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
<div className="flex gap-2">
    <IconButton onClick={handleView} className="bg-[var(--color-brand)] text-[var(--color-text-primary)] hover:bg-[var(--color-brand-hover)] transition">
    <Eye size={16} />
    </IconButton>
    <IconButton onClick={handleEdit} className="bg-[var(--color-brand)] text-[var(--color-text-primary)] hover:bg-[var(--color-brand-hover)] transition">
    <Pencil size={16} />
    </IconButton>
    <IconButton onClick={handleDelete} className="bg-[var(--color-error)] text-[var(--color-text-inverse)] hover:bg-[var(--color-error-hover)] transition">
    <Trash2 size={16} />
    </IconButton>
</div>
);
}