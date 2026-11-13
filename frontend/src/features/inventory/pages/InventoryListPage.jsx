import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DataTable, Button } from "@/shared";
import { inventoryColumns } from "../table/inventoryColumns";
import { getInventory } from "../services/inventoryServices";
import ReportConfigModal from "../reports/components/ReportConfigModal";
import { hasPermission } from "@/features/permissions/services/permissionServices";

export default function InventoryListPage() {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canCreate, setCanCreate] = useState(false);
  const [canReport, setCanReport] = useState(false);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const [data, createPerm, reportPerm] = await Promise.all([
          getInventory(),
          hasPermission("create_inventory"),
          hasPermission("report_inventory"),
        ]);
        setInventoryData(data);
        setCanCreate(createPerm);
        setCanReport(reportPerm);
      } catch (error) {
        console.error("Error al obtener el inventario:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-8 md:pt-10 pb-10 flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-bold font-[var(--font-heading)] text-[var(--color-text-inverse)]">
          Listado de Inventario
        </h1>

        <div className="flex flex-wrap items-center justify-start sm:justify-end gap-3">
          {canReport && (
            <Button 
              variant="primary" 
              onClick={() => setIsReportModalOpen(true)}
            >
              Reportar inventario
            </Button>
          )}

          {canCreate && (
            <Link to="/dashboard/createInventory">
              <Button variant="primary">
                Crear inventario
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="bg-[var(--color-background-inverse)] rounded-3xl border border-[var(--color-brand)] shadow-2xl p-4 sm:p-6 md:p-8 overflow-hidden">
        {loading ? (
          <p className="text-[var(--color-text-inverse)] text-center py-8">
            Cargando inventario de la base de datos...
          </p>
        ) : (
          <DataTable data={inventoryData} columns={inventoryColumns} />
        )}
      </div>

      <ReportConfigModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </section>
  );
}