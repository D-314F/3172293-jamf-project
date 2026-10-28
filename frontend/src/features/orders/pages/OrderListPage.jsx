// src/features/orders/pages/OrderListPage.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable, Button } from "@/shared";
import { OrderColumns } from "../table/OrderColumns";
import { INITIAL_ORDERS } from "../data/ordersData";
import ReportConfigModal from "../reports/components/ReportConfigModal";

export default function OrderListPage() {
  const navigate = useNavigate();
  const [orders] = useState(INITIAL_ORDERS);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  return (
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-8 md:pt-10 pb-10">
      
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-[var(--font-heading)] text-[var(--color-text-inverse)]">
            Listado de Órdenes
          </h1>
        </div>

        <div className="flex flex-wrap items-center justify-start sm:justify-end gap-3">
          <Button 
            variant="primary"
            onClick={() => setIsReportModalOpen(true)}
          >
            Generar reporte
          </Button>

          <Button 
            variant="primary"
            onClick={() => navigate("/dashboard/orders/create")}
          >
            Agregar orden
          </Button>
        </div>
      </div>

      {/* Tarjeta contenedora con la tabla de datos */}
      <div className="bg-[var(--color-background-inverse)] rounded-2xl md:rounded-3xl border border-[var(--color-brand)] shadow-2xl p-4 sm:p-6 md:p-8 overflow-hidden">
        <DataTable data={orders} columns={OrderColumns} />
      </div>

      {/* Modal de Configuración de Reportes */}
      <ReportConfigModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </section>
  );
}