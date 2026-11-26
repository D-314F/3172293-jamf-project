import OrderStatusCell from "../components/OrderStatusCell";
import OrderRowActions from "../components/OrderRowActions";

export const getOrderColumns = ({ canView = true, canEdit = true } = {}) => [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "mesa",
    header: "Mesa",
    cell: ({ row }) => (
      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[var(--color-brand)]/15 text-[var(--color-brand)] border border-[var(--color-brand)]/30">
        Mesa #{row.original.mesa}
      </span>
    ),
  },
  {
    accessorKey: "mesero",
    header: "Mesero",
  },
  {
    accessorKey: "detalles",
    header: "Platillos solicitados",
  },
  {
    accessorKey: "fecha",
    header: "Fecha y hora",
    cell: ({ row }) => {
      const fecha = row.original.fecha;
      return fecha ? new Date(fecha).toLocaleString("es-CO") : "Reciente";
    },
  },
  {
    accessorKey: "estado",
    header: "Estado (Cocina / Caja)",
    cell: ({ row }) => (
      <OrderStatusCell
        key={`order-status-${row.original.id}`}
        order={row.original}
        canEdit={canEdit}
      />
    ),
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => (
      <OrderRowActions
        order={row.original}
        canView={canView}
        canEdit={canEdit}
      />
    ),
  },
];

export const OrderColumns = getOrderColumns();
