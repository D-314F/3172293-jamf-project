import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FileSpreadsheet, Plus } from "lucide-react";
import { DataTable, Button } from "@/shared";
import { dishColumns } from "../table/dishColumns";
import ReportConfigModal from "../reports/components/ReportConfigModal";
import { getDishes } from "../services/dishServices";
import { hasPermission } from "@/features/permissions/services/permissionServices";

export default function DishListPage() {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canCreate, setCanCreate] = useState(false);
  const [canReport, setCanReport] = useState(false);

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const [data, createPerm, reportPerm] = await Promise.all([
          getDishes(),
          hasPermission("create_dishes"),
          hasPermission("report_dishes"),
        ]);
        setDishes(data);
        setCanCreate(createPerm);
        setCanReport(reportPerm);
      } catch (error) {
        console.error("Error al obtener los platillos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDishes();
  }, []);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-main font-[var(--font-heading)] text-[var(--color-text-inverse)]">
            Listado de Platillos
          </h1>
          <p className="text-medium text-[var(--color-text-muted)]">
            Catálogo gastronómico, precios y disponibilidad en menú
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-start sm:justify-end gap-3">
          {canReport && (
            <Button
              variant="secondary"
              onClick={() => setIsReportModalOpen(true)}
            >
              <FileSpreadsheet className="w-4 h-4" />
              Reportar platillos
            </Button>
          )}

          {canCreate && (
            <Link to="/dashboard/dishCreate">
              <Button variant="primary">
                <Plus className="w-4 h-4" />
                Crear platillo
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="bg-[var(--color-background-inverse)] rounded-3xl border border-[var(--color-brand)]/50 shadow-2xl p-4 sm:p-6 md:p-8 overflow-x-auto">
        {loading ? (
          <p className="text-[var(--color-text-inverse)] text-center py-8 text-body">
            Cargando platillos de la base de datos...
          </p>
        ) : (
          <DataTable data={dishes} columns={dishColumns} />
        )}
      </div>

      <ReportConfigModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </section>
  );
}