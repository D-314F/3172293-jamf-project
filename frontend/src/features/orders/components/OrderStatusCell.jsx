import { Select } from "@/shared";
import { ESTADOS_ORDEN } from "../data/ordersData";
import { updateOrder } from "../services/orderServices";

export default function OrderStatusCell({ order, canEdit = true }) {
  const status = order.estado || "En preparación";

  const handleStatusChange = async (newStatus) => {
    await updateOrder(order.id, { estado: newStatus });

    window.dispatchEvent(
      new CustomEvent("jamf:order-status-updated", {
        detail: { id: order.id, estado: newStatus },
      })
    );
  };

  return (
    <div className="min-w-[185px]">
      <Select
        value={status}
        options={ESTADOS_ORDEN}
        disabled={!canEdit}
        onChange={handleStatusChange}
        confirmChange={true}
        hidePlaceholder={true}
        itemName={`la orden #${order.id} (Mesa ${order.mesa})`}
        className="bg-[var(--color-background)] text-[var(--color-text-primary)] min-h-[48px] text-medium font-medium border-[var(--color-brand)] cursor-pointer"
      />
    </div>
  );
}
