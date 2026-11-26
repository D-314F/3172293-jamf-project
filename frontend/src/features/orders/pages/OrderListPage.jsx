import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileSpreadsheet,
  Plus,
  Utensils,
  User,
  Clock,
  CheckCircle2,
  ChefHat,
  CalendarDays,
  RotateCcw,
} from "lucide-react";
import { DataTable, Button } from "@/shared";
import { OrderColumns } from "../table/OrderColumns";
import ReportConfigModal from "../reports/components/ReportConfigModal";
import { getOrders } from "../services/orderServices";
import { hasPermission } from "@/features/permissions/services/permissionServices";

// Retorna fecha local en formato YYYY-MM-DD
function getTodayLocal() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function getStatusBadgeStyle(estado = "") {
  const normalized = estado.toLowerCase();
  if (normalized.includes("pagad") || normalized.includes("entregad")) {
    return "bg-[var(--color-success)]/15 text-[var(--color-success)] border-[var(--color-success)]/40";
  }
  if (normalized.includes("cancelad")) {
    return "bg-[var(--color-error)]/15 text-[var(--color-error)] border-[var(--color-error)]/40";
  }
  return "bg-[var(--color-warning)]/15 text-[var(--color-warning)] border-[var(--color-warning)]/40";
}

export default function OrderListPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [canCreate, setCanCreate] = useState(false);
  const [canReport, setCanReport] = useState(false);

  // Filtro de fecha: por defecto = hoy, "" = ver todos
  const [selectedDate, setSelectedDate] = useState(getTodayLocal());

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const [data, createPerm, reportPerm] = await Promise.all([
          getOrders(),
          hasPermission("create_orders"),
          hasPermission("report_orders"),
        ]);
        setOrders(Array.isArray(data) ? data : []);
        setCanCreate(createPerm);
        setCanReport(reportPerm);
      } catch (error) {
        console.error("Error al obtener las órdenes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const handleStatusUpdated = (event) => {
      const { id, estado } = event.detail;
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, estado } : o))
      );
    };

    window.addEventListener("jamf:order-status-updated", handleStatusUpdated);
    return () => {
      window.removeEventListener(
        "jamf:order-status-updated",
        handleStatusUpdated
      );
    };
  }, []);

  // Filtra por fecha seleccionada. Si selectedDate está vacío, muestra todas.
  const filteredOrders = useMemo(() => {
    if (!selectedDate) return orders;
    return orders.filter((o) => {
      if (!o.fecha) return false;
      const orderDate = new Date(o.fecha);
      const yyyy = orderDate.getFullYear();
      const mm = String(orderDate.getMonth() + 1).padStart(2, "0");
      const dd = String(orderDate.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}` === selectedDate;
    });
  }, [orders, selectedDate]);

  const isToday = selectedDate === getTodayLocal();

  // Tickets inferiores usan filteredOrders
  const completedOrders = filteredOrders.filter((o) =>
    ["entregada", "pagada"].includes((o.estado || "").toLowerCase())
  );
  const ticketOrders = (
    completedOrders.length > 0 ? completedOrders : filteredOrders
  ).slice(0, 4);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-10 space-y-8">
      {/* Cabecera y Acciones */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-main font-[var(--font-heading)] text-[var(--color-text-inverse)]">
            Listado de Órdenes
          </h1>
          <p className="text-medium text-[var(--color-text-muted)]">
            Control de comandas activas e historial de servicio
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-start sm:justify-end gap-4">
          {canReport && (
            <Button
              variant="secondary"
              onClick={() => setIsReportModalOpen(true)}
            >
              <FileSpreadsheet className="w-4 h-4" />
              Generar reporte
            </Button>
          )}

          {canCreate && (
            <Button
              variant="primary"
              onClick={() => navigate("/dashboard/orders/create")}
            >
              <Plus className="w-4 h-4" />
              Agregar orden
            </Button>
          )}
        </div>
      </div>

      {/* Tabla Principal */}
      <div className="bg-[var(--color-background-inverse)] rounded-3xl border border-[var(--color-brand)]/50 shadow-2xl p-4 sm:p-6 md:p-8 overflow-hidden space-y-5">
        {/* Barra de filtro por fecha */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[var(--color-border)]/60">
          <div className="flex items-center gap-2 text-small font-[var(--font-label)] text-[var(--color-brand)]">
            <CalendarDays className="w-4 h-4" />
            <span>
              {selectedDate
                ? isToday
                  ? "Órdenes de hoy"
                  : `Órdenes del ${new Date(selectedDate + "T00:00:00").toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" })}`
                : "Todas las órdenes"}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Input de fecha */}
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              aria-label="Filtrar por fecha"
              className="min-h-[48px] bg-[var(--color-surface-dark)] border border-[var(--color-border)] text-[var(--color-text-inverse)] rounded-xl px-4 py-2 text-medium font-[var(--font-label)] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] transition"
            />

            {/* Botón ver todos */}
            {selectedDate && (
              <button
                onClick={() => setSelectedDate("")}
                className="flex items-center gap-1.5 min-h-[48px] px-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-dark)] text-[var(--color-text-muted)] text-medium font-[var(--font-label)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)] transition cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Ver todos
              </button>
            )}

            {/* Botón volver a hoy */}
            {!isToday && (
              <button
                onClick={() => setSelectedDate(getTodayLocal())}
                className="flex items-center gap-1.5 min-h-[48px] px-4 rounded-xl border border-[var(--color-brand)]/50 bg-[var(--color-brand)]/10 text-[var(--color-brand)] text-medium font-[var(--font-label)] hover:bg-[var(--color-brand)]/20 transition cursor-pointer"
              >
                <CalendarDays className="w-4 h-4" />
                Hoy
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <p className="text-[var(--color-text-inverse)] text-center py-8 text-body">
            Cargando órdenes de la base de datos...
          </p>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <CalendarDays className="w-10 h-10 text-[var(--color-brand)]/40 mx-auto" />
            <p className="text-body text-[var(--color-text-muted)]">
              {selectedDate
                ? "No hay órdenes para esta fecha."
                : "No hay órdenes registradas."}
            </p>
            {selectedDate && (
              <button
                onClick={() => setSelectedDate("")}
                className="text-medium text-[var(--color-brand)] underline underline-offset-2 cursor-pointer"
              >
                Ver todas las órdenes
              </button>
            )}
          </div>
        ) : (
          <DataTable data={filteredOrders} columns={OrderColumns} />
        )}
      </div>

      {/* Sección Inferior Tipo "Track Order" */}
      {!loading && ticketOrders.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-title font-[var(--font-heading)] text-[var(--color-text-inverse)] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[var(--color-brand)]" />
              {completedOrders.length > 0
                ? "Órdenes Completadas Recientes"
                : "Seguimiento Rápido de Comandas"}
            </h2>
            <span className="text-small text-[var(--color-text-muted)]">
              Mostrando {ticketOrders.length} comandas
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {ticketOrders.map((order) => {
              const items = String(order.detalles || "")
                .split(",")
                .map((i) => i.trim())
                .filter(Boolean);

              return (
                <div
                  key={order.id}
                  onClick={() => navigate(`/dashboard/orders/detail/${order.id}`)}
                  className="flex flex-col justify-between rounded-2xl bg-[var(--color-background-inverse)] border border-[var(--color-border)] hover:border-[var(--color-brand)] p-5 shadow-xl transition cursor-pointer group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 pb-3 border-b border-dashed border-[var(--color-border)]">
                      <div>
                        <p className="text-subtitle font-[var(--font-heading)] text-[var(--color-text-inverse)] group-hover:text-[var(--color-brand)] transition">
                          Mesa {order.mesa}
                        </p>
                        <p className="text-small text-[var(--color-text-muted)] flex items-center gap-1 mt-0.5">
                          <User className="w-3.5 h-3.5 text-[var(--color-brand)]" />
                          {order.mesero || "Sin asignar"}
                        </p>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg text-caption font-[var(--font-heading)] bg-[var(--color-surface-dark)] text-[var(--color-brand)] border border-[var(--color-border)]">
                        #{order.id}
                      </span>
                    </div>

                    <p className="text-caption text-[var(--color-text-muted)] flex items-center gap-1.5 py-2.5">
                      <Clock className="w-3.5 h-3.5 text-[var(--color-brand)]" />
                      {order.fecha
                        ? new Date(order.fecha).toLocaleString("es-CO")
                        : "Reciente"}
                    </p>

                    <div className="space-y-1.5 py-2 border-t border-dashed border-[var(--color-border)]/60">
                      <p className="text-caption uppercase tracking-wider text-[var(--color-text-muted)] flex items-center gap-1">
                        <ChefHat className="w-3.5 h-3.5 text-[var(--color-brand)]" />
                        Platillos ({items.length})
                      </p>
                      <ul className="space-y-1">
                        {items.slice(0, 3).map((item, idx) => (
                          <li
                            key={idx}
                            className="text-small text-[var(--color-text-inverse)] truncate flex items-center gap-1.5"
                          >
                            <Utensils className="w-3 h-3 text-[var(--color-brand)] shrink-0" />
                            <span className="truncate">{item}</span>
                          </li>
                        ))}
                        {items.length > 3 && (
                          <li className="text-caption text-[var(--color-brand)]">
                            +{items.length - 3} más...
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-[var(--color-border)]/50">
                    <span
                      className={`w-full inline-flex items-center justify-center py-1.5 px-3 rounded-xl text-small font-[var(--font-heading)] border ${getStatusBadgeStyle(order.estado)}`}
                    >
                      {order.estado || "Pendiente"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <ReportConfigModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </section>
  );
}