import { Select } from "@/shared";
import InventoryRowActions from "../components/InventoryRowActions";
import { INVENTORY_STATUS_OPTIONS } from "../data/inventory";

export const inventoryColumns = [
  { accessorKey: "id", header: "Id" },
  { accessorKey: "name", header: "Nombre" },
  { accessorKey: "barcode", header: "Código de barras" },
  { accessorKey: "quantity", header: "Cantidad existente" },
  { accessorKey: "unitPrice", header: "Precio" },
  { accessorKey: "brand", header: "Marca" },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const item = row.original;

      const handleStatusChange = (newStatus) => {
        item.status = newStatus;
      };

      return (
        <div className="min-w-[140px]">
          <Select
            value={item.status}
            options={INVENTORY_STATUS_OPTIONS}
            onChange={handleStatusChange}
            confirmChange={true}
            hidePlaceholder={true}
            itemName={`"${item.name}"`}
            className="bg-white text-[var(--color-text-primary)] h-9 text-sm font-medium border-[var(--color-brand)] cursor-pointer"
          />
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => <InventoryRowActions item={row.original} />,
  },
];