import { useState, useEffect } from "react";
import { Select } from "@/shared";
import InventoryRowActions from "../components/InventoryRowActions";
import { INVENTORY_STATUS_OPTIONS } from "../data/inventory";
import { updateInventory } from "../services/inventoryServices";

function InventoryStatusCell({ item, canEdit = true }) {
  const [currentStatus, setCurrentStatus] = useState(
    item.status || "Disponible"
  );

  useEffect(() => {
    setCurrentStatus(item.status || "Disponible");
  }, [item.id, item.status]);

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

export const getInventoryColumns = ({
  canView = true,
  canEdit = true,
} = {}) => [
  {
    accessorKey: "codigo",
    header: "Código",
    cell: ({ row }) => (
      <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-[var(--color-brand)]/15 text-[var(--color-brand)] border border-[var(--color-brand)]/30">
        {row.original.codigo || `INV-${row.original.id}`}
      </span>
    ),
  },
  {
    accessorKey: "name",
    header: "Insumo / Producto",
    cell: ({ row }) => (
      <span className="font-medium text-[var(--color-text-inverse)]">
        {row.original.name}
      </span>
    ),
  },
  {
    accessorKey: "brand",
    header: "Proveedor que suministra",
  },
  {
    accessorKey: "quantity",
    header: "Stock actual",
    cell: ({ row }) => (
      <span className="font-semibold">{row.original.quantity ?? 0} uds.</span>
    ),
  },
  {
    accessorKey: "unitPrice",
    header: "Valor unitario",
    cell: ({ row }) =>
      `$${Number(row.original.unitPrice ?? 0).toLocaleString("es-CO")}`,
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => (
      <InventoryStatusCell
        key={`inv-status-${row.original.id}`}
        item={row.original}
        canEdit={canEdit}
      />
    ),
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => (
      <InventoryRowActions
        item={row.original}
        canView={canView}
        canEdit={canEdit}
      />
    ),
  },
];

export const inventoryColumns = getInventoryColumns();
