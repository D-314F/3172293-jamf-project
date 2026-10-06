// src/features/inventory/pages/InventoryListPage.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { DataTable, Button } from "@/shared";
import { inventoryColumns } from "../table/inventoryColumns";
import { inventory } from "../data/inventory";
import ReportConfigModal from "../reports/components/ReportConfigModal";

export default function InventoryListPage() {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-20 md:pt-28 pb-10">
      
      {/* Header Responsivo: Título a la izquierda, Botones a la derecha (en móvil se apilan) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-white">
          Listado de Inventario
        </h1>

        <div className="flex flex-wrap items-center justify-start sm:justify-end gap-3">
          <Button 
            variant="secondary" 
            onClick={() => setIsReportModalOpen(true)}
          >
            Reportar inventario
          </Button>

          <Link to="/dashboard/createInventory">
            <Button variant="primary">
              Crear inventario
            </Button>
          </Link>
        </div>
      </div>

      {/* Tarjeta contenedora con la tabla */}
      <div className="bg-[var(--color-background-inverse)] rounded-2xl md:rounded-3xl border border-[var(--color-brand)] shadow-2xl p-4 sm:p-6 md:p-8 overflow-hidden">
        <DataTable data={inventory} columns={inventoryColumns} />
      </div>

      {/* Modal de Configuración de Reportes */}
      <ReportConfigModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </section>
  );
}