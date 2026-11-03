import { useState } from "react";
import { Select } from "@/shared";
import InventoryRowActions from "../components/InventoryRowActions";
import { INVENTORY_STATUS_OPTIONS } from "../data/inventory";
import { updateInventory } from "../services/inventoryServices";

function InventoryStatusCell({ item }) {
  const [currentStatus, setCurrentStatus] = useState(item.status || "Disponible");

  const handleStatusChange = async (newStatus) => {
    setCurrentStatus(newStatus);
    item.status = newStatus;
    item.isActive = newStatus === "Disponible";
    await updateInventory(item.id, { status: newStatus });
  };

  return (
    <div className="min-w-[140px]">
      <Select
        value={currentStatus}
        options={INVENTORY_STATUS_OPTIONS}
        onChange={handleStatusChange}
        confirmChange={true}
        hidePlaceholder={true}
        itemName={`"${item.name}"`}
        className="bg-white text-[var(--color-text-primary)] h-9 text-sm font-medium border-[var(--color-brand)] cursor-pointer"
      />
    </div>
  );
}

export const inventoryColumns = [
  { accessorKey: "id", header: "Id" },
  { accessorKey: "name", header: "Nombre" },
  { accessorKey: "barcode", header: "Código de barras" },
  { accessorKey: "quantity", header: "Cantidad existente" },
  { 
    accessorKey: "unitPrice", 
    header: "Precio",
    cell: ({ row }) => `$${row.original.unitPrice ?? 0}`
  },
  { accessorKey: "brand", header: "Marca" },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => <InventoryStatusCell item={row.original} />,
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => <InventoryRowActions item={row.original} />,
  },
];