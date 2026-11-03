import { useState, useEffect } from "react";
import { DataTable, Button } from "@/shared";
import { providerColumns } from "../table/providerColumns";
import { getProviders } from "../services/providerServices";
import ReportConfigModal from "../reports/components/ReportConfigModal";
import { Link } from "react-router-dom";

export default function ProviderListPage() {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const data = await getProviders();
        setProviders(data);
      } catch (error) {
        console.error("Error al obtener proveedores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-8 md:pt-10 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold font-[var(--font-heading)] text-[var(--color-text-inverse)]">
          Listado de Proveedores
        </h1>

        <div className="flex flex-wrap items-center justify-start sm:justify-end gap-3">
          <Button variant="primary" onClick={() => setIsReportModalOpen(true)}>
            Reportar proveedor
          </Button>

          <Link to="/dashboard/providerCreate">
            <Button variant="primary">Crear proveedor</Button>
          </Link>
        </div>
      </div>

      <div className="bg-[var(--color-background-inverse)] rounded-2xl md:rounded-3xl border border-[var(--color-brand)] shadow-2xl p-4 sm:p-6 md:p-8 overflow-hidden">
        {loading ? (
          <p className="text-[var(--color-text-inverse)] text-center py-8">
            Cargando proveedores de la base de datos...
          </p>
        ) : (
          <DataTable data={providers} columns={providerColumns} />
        )}
      </div>

      <ReportConfigModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </section>
  );
}