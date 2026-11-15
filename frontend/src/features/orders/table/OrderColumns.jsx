import { useState, useEffect } from "react";
import { Select } from "@/shared";
import OrderRowActions from "../components/OrderRowActions";
import { ESTADOS_ORDEN } from "../data/ordersData";
import { updateOrder } from "../services/orderServices";

function OrderStatusCell({ order }) {
  const [status, setStatus] = useState(order.estado || "En preparación");

  useEffect(() => {
    setStatus(order.estado || "En preparación");
  }, [order.id, order.estado]);

  const handleStatusChange = async (newStatus) => {
    await updateOrder(order.id, { estado: newStatus });
    order.estado = newStatus;
    setStatus(newStatus);
  };

  return (
    <div className="min-w-[185px]">
      <Select
        value={status}
        options={ESTADOS_ORDEN}
        onChange={handleStatusChange}
        confirmChange={true}
        hidePlaceholder={true}
        itemName={`la orden #${order.id} (Mesa ${order.mesa})`}
        className="bg-white text-[var(--color-text-primary)] h-9 text-sm font-medium border-[var(--color-brand)] cursor-pointer"
      />
    </div>
  );
}

export const OrderColumns = [
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
      />
    ),
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => <OrderRowActions order={row.original} />,
  },
];