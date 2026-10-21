// src/features/orders/table/OrderColumns.js

import OrderRowActions from "../components/OrderRowActions";

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
    cell: ({ row }) => (
      <span className="text-[var(--color-text-primary)] font-medium">
        {row.original.estado}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => <OrderRowActions order={row.original} />,
  },
];