// src/features/orders/components/OrderDetail.jsx

import Button from "@/shared/components/Button";
import Input from "@/shared/components/Input";

export default function OrderDetail({ order, onEdit, onBack }) {
  if (!order) return null;

  return (
    <div className="bg-[var(--color-background-inverse)] text-[var(--color-text-inverse)] rounded-3xl p-6 sm:p-10 max-w-6xl mx-auto grid grid-cols-1 gap-8 border border-[var(--color-brand)] shadow-2xl">
      
      {/* Título de la orden dentro de la Card y Estado */}
      <div className="flex items-center justify-between pb-2">

        <h3>
            visualizar orden
        </h3>


        <h2 className="text-[var(--text-display)] font-[var(--font-heading)] text-[var(--color-text-inverse)]">
          Detalle de la Orden #{order.id || "ORD-012"}
        </h2>

        {/* Estado en texto simple */}
        {/* <div className="flex items-center gap-2">
          <span className="text-[var(--text-small)] font-medium text-[var(--color-text-inverse)]">
            Estado: {order.estado}
          </span>
        </div> */}
      </div>

      {/* Datos de la orden en formato de Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className="block text-[var(--text-small)] font-[var(--font-label)] mb-1">
            Mesa asignada
          </label>
          <Input
            type="text"
            value={`Mesa ${order.mesa}`}
            readOnly
            className="w-full bg-transparent border border-[var(--color-border)] rounded-md px-3 py-2 text-[var(--color-text-muted)]"
          />
        </div>

        <div>
          <label className="block text-[var(--text-small)] font-[var(--font-label)] mb-1">
            Mesero responsable
          </label>
          <Input
            type="text"
            value={order.mesero}
            readOnly
            className="w-full bg-transparent border border-[var(--color-border)] rounded-md px-3 py-2 text-[var(--color-text-muted)]"
          />
        </div>

        <div>
          <label className="block text-[var(--text-small)] font-[var(--font-label)] mb-1">
            Fecha y hora de registro
          </label>
          <Input
            type="text"
            value={order.fecha ? new Date(order.fecha).toLocaleString("es-CO") : "Reciente"}
            readOnly
            className="w-full bg-transparent border border-[var(--color-border)] rounded-md px-3 py-2 text-[var(--color-text-muted)]"
          />
        </div>

        <div>
          <label className="block text-[var(--text-small)] font-[var(--font-label)] mb-1">
            Estado de la orden
          </label>
          <Input
            type="text"
            value={order.estado}
            readOnly
            className="w-full bg-transparent border border-[var(--color-border)] rounded-md px-3 py-2 text-[var(--color-text-muted)]"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-[var(--text-small)] font-[var(--font-label)] mb-1">
            Detalles de la orden / Platillos solicitados
          </label>
          <textarea
            value={order.detalles}
            readOnly
            rows={3}
            className="w-full bg-transparent border border-[var(--color-border)] rounded-md px-3 py-2 text-[var(--color-text-muted)] resize-none"
          />
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="flex justify-end gap-3 pt-2">
        {onBack && (
          <Button variant="secondary" type="button" onClick={onBack}>
            Volver a la lista
          </Button>
        )}
        {onEdit && (
          <Button variant="primary" type="button" onClick={onEdit}>
            Editar Orden
          </Button>
        )}
      </div>

    </div>
  );
}