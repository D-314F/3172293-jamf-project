// src/features/orders/components/OrderDetail.jsx

import { Button, Input } from "@/shared";

export default function OrderDetail({ order, onEdit, onBack }) {
  if (!order) return null;

  const formattedDate = order.fecha
    ? new Date(order.fecha).toLocaleString("es-CO")
    : "Reciente";

  return (
    <div className="bg-[var(--color-background-inverse)] text-[var(--color-text-inverse)] rounded-3xl p-6 sm:p-10 w-full grid grid-cols-1 gap-8 border border-[var(--color-brand)] shadow-2xl">
      
      
      <div className="flex items-center justify-between pb-2 border-b border-[var(--color-brand)]/30">
        <h2 className="text-xl sm:text-2xl font-bold font-[var(--font-heading)] text-[var(--color-text-inverse)]">
          Detalle de la Orden #{order.id || "ORD-012"}
        </h2>
      </div>

      {/* Datos de la orden */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <Input
          label="Mesa asignada"
          type="text"
          value={`Mesa ${order.mesa ?? ""}`}
          readOnly
        />

        <Input
          label="Mesero responsable"
          type="text"
          value={order.mesero || ""}
          readOnly
        />

        <Input
          label="Fecha y hora de registro"
          type="text"
          value={formattedDate}
          readOnly
        />

        <Input
          label="Estado de la orden"
          type="text"
          value={order.estado || ""}
          readOnly
        />

        <div className="sm:col-span-2 flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--color-text-inverse)] font-[var(--font-label)]">
            Detalles de la orden / Platillos solicitados
          </label>
          <textarea
            value={order.detalles || ""}
            readOnly
            rows={3}
            className="w-full bg-transparent border border-[var(--color-brand)]/40 rounded-xl px-4 py-3 text-[var(--color-text-inverse)] resize-none focus:outline-none"
          />
        </div>
      </div>

   
      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
        {onBack && (
          <Button
            variant="secondary"
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto"
          >
            Volver a la lista
          </Button>
        )}
        {onEdit && (
          <Button
            variant="primary"
            type="button"
            onClick={onEdit}
            className="w-full sm:w-auto"
          >
            Editar Orden
          </Button>
        )}
      </div>

    </div>
  );
}