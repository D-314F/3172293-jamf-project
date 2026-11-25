import { Select } from "@/shared";
import { INVENTORY_STATUS_OPTIONS } from "../data/inventory";
import { updateInventory } from "../services/inventoryServices";

export default function InventoryStatusCell({ item, canEdit = true }) {
  const currentStatus = item.status || "Disponible";

  const handleStatusChange = async (newStatus) => {
    await updateInventory(item.id, { status: newStatus });

    window.dispatchEvent(
      new CustomEvent("jamf:inventory-status-updated", {
        detail: {
          id: item.id,
          status: newStatus,
          isActive: newStatus === "Disponible",
        },
      })
    );
  };

  return (
    <div className="min-w-[140px]">
      <Select
        value={currentStatus}
        options={INVENTORY_STATUS_OPTIONS}
        disabled={!canEdit}
        onChange={handleStatusChange}
        confirmChange={true}
        hidePlaceholder={true}
        itemName={`"${item.name}"`}
        className="bg-[var(--color-background)] text-[var(--color-text-primary)] min-h-[48px] text-medium font-medium border-[var(--color-brand)] cursor-pointer"
      />
    </div>
  );
}
