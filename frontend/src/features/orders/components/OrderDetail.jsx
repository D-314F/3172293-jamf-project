// src/features/orders/components/OrderDetail.jsx
import {
  Utensils,
  User,
  CalendarClock,
  CheckCircle2,
  ChefHat,
  Pencil,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/shared";

export default function OrderDetail({ order, onEdit, onBack }) {
  if (!order) return null;

  const formattedDate = order.fecha
    ? new Date(order.fecha).toLocaleString("es-CO")
    : "Reciente";

  const dishItems = String(order.detalles || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <div className="bg-[var(--color-background-inverse)] text-[var(--color-text-inverse)] rounded-3xl p-6 sm:p-8 w-full space-y-6 border border-[var(--color-brand)]/50 shadow-2xl">
      {/* Cabecera */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[var(--color-border)]">
        <div>
          <span className="text-caption uppercase tracking-wider text-[var(--color-brand)] font-[var(--font-heading)]">
            Comanda de Restaurante
          </span>
          <h2 className="text-main font-[var(--font-heading)] text-[var(--color-text-inverse)]">
            Detalle de la Orden #{order.id || "ORD"}
          </h2>
        </div>

        <span className="px-4 py-1.5 rounded-full text-small font-[var(--font-heading)] bg-[var(--color-brand)] text-[var(--color-text-primary)]">
          {order.estado || "Pendiente"}
        </span>
      </div>

      {/* Distribución 2 Columnas estilo Imagen 7 (Kasirin Detail Order) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Columna Izquierda: Información de Mesa y Mesero */}
        <div className="md:col-span-5 flex flex-col gap-3 p-5 rounded-2xl bg-[var(--color-surface-dark)] border border-[var(--color-border)]/70">
          <h3 className="text-subtitle font-[var(--font-heading)] text-[var(--color-text-inverse)] pb-2 border-b border-[var(--color-border)]/50">
            Información del Servicio
          </h3>

          <div className="flex items-center gap-3 py-2">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-brand)]/15 text-[var(--color-brand)]">
              <Utensils className="w-5 h-5" />
            </span>
            <div>
              <p className="text-small text-[var(--color-text-muted)]">
                Mesa asignada
              </p>
              <p className="text-body font-[var(--font-heading)] text-[var(--color-text-inverse)]">
                Mesa {order.mesa ?? "-"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 py-2">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-brand)]/15 text-[var(--color-brand)]">
              <User className="w-5 h-5" />
            </span>
            <div>
              <p className="text-small text-[var(--color-text-muted)]">
                Mesero responsable
              </p>
              <p className="text-body font-[var(--font-heading)] text-[var(--color-text-inverse)]">
                {order.mesero || "No asignado"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 py-2">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-brand)]/15 text-[var(--color-brand)]">
              <CalendarClock className="w-5 h-5" />
            </span>
            <div>
              <p className="text-small text-[var(--color-text-muted)]">
                Fecha y hora de registro
              </p>
              <p className="text-medium font-[var(--font-body)] text-[var(--color-text-inverse)]">
                {formattedDate}
              </p>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Platillos Solicitados (Comanda) */}
        <div className="md:col-span-7 flex flex-col justify-between p-5 rounded-2xl bg-[var(--color-surface-dark)] border border-[var(--color-border)]/70 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border)]/50">
              <h3 className="text-subtitle font-[var(--font-heading)] text-[var(--color-text-inverse)] flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-[var(--color-brand)]" />
                Platillos Solicitados
              </h3>
              <span className="text-small text-[var(--color-text-muted)]">
                {dishItems.length} ítem(s)
              </span>
            </div>

            {dishItems.length > 0 ? (
              <div className="space-y-2">
                {dishItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-3 rounded-xl bg-[var(--color-background-inverse)] border border-[var(--color-border)]/60 px-4 py-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <CheckCircle2 className="w-4 h-4 text-[var(--color-brand)] shrink-0" />
                      <span className="text-medium font-[var(--font-body)] text-[var(--color-text-inverse)] break-words">
                        {item}
                      </span>
                    </div>
                    <span className="text-caption px-2.5 py-0.5 rounded-md bg-[var(--color-surface-dark)] text-[var(--color-text-muted)] shrink-0">
                      Ítem #{idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-medium text-[var(--color-text-muted)] py-4">
                No se especificaron detalles en esta orden.
              </p>
            )}
          </div>

          <div className="pt-3 border-t border-dashed border-[var(--color-border)] flex items-center justify-between text-medium">
            <span className="text-[var(--color-text-muted)]">
              Estado actual en cocina / caja
            </span>
            <span className="font-[var(--font-heading)] text-[var(--color-brand)]">
              {order.estado || "Pendiente"}
            </span>
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
        {onBack && (
          <Button
            variant="secondary"
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4" />
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
            <Pencil className="w-4 h-4" />
            Editar Orden
          </Button>
        )}
      </div>
    </div>
  );
}