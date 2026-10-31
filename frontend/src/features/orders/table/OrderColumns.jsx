import { Select } from "@/shared";
import OrderRowActions from "../components/OrderRowActions";
import { ESTADOS_ORDEN } from "../data/ordersData";

export const OrderColumns = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "mesa",
    header: "Mesa",
  },
  {
    accessorKey: "mesero",
    header: "Mesero",
  },
  {
    accessorKey: "detalles",
    header: "Platillos",
  },
  {
    accessorKey: "fecha",
    header: "Fecha",
    cell: ({ row }) => {
      const fecha = row.original.fecha;
      return fecha
        ? new Date(fecha).toLocaleString("es-CO")
        : "Reciente";
    },
  },
  {
    accessorKey: "estado",
    header: "Estado",
    cell: ({ row }) => {
      const order = row.original;

      const handleStatusChange = (newStatus) => {
        order.estado = newStatus;
      };

      return (
        <div className="min-w-[155px]">
          <Select
            value={order.estado}
            options={ESTADOS_ORDEN}
            onChange={handleStatusChange}
            confirmChange={true}
            hidePlaceholder={true}
            itemName={`la orden ${order.id}`}
            className="bg-white text-[var(--color-text-primary)] h-9 text-sm font-medium border-[var(--color-brand)] cursor-pointer"
          />
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => <OrderRowActions order={row.original} />,
  },
];