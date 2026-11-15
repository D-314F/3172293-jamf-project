import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { FileSpreadsheet, Plus, Filter, RotateCcw } from "lucide-react";
import { DataTable, Button } from "@/shared";
import {
  providerColumns,
  formatProviderDocumentType,
} from "../table/providerColumns";
import { getProviders } from "../services/providerServices";
import ReportConfigModal from "../reports/components/ReportConfigModal";
import { hasPermission } from "@/features/permissions/services/permissionServices";

export default function ProviderListPage() {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canCreate, setCanCreate] = useState(false);
  const [canReport, setCanReport] = useState(false);

  const [docTypeFilter, setDocTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const [data, createPerm, reportPerm] = await Promise.all([
          getProviders(),
          hasPermission("create_providers"),
          hasPermission("report_providers"),
        ]);
        setProviders(Array.isArray(data) ? data : []);
        setCanCreate(createPerm);
        setCanReport(reportPerm);
      } catch (error) {
        console.error("Error al obtener proveedores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  useEffect(() => {
    const handleStatusUpdated = (event) => {
      const { id, isActive } = event.detail;
      setProviders((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, isActive, providerStatus: isActive } : p
        )
      );
    };

    window.addEventListener("jamf:provider-status-updated", handleStatusUpdated);
    return () => {
      window.removeEventListener(
        "jamf:provider-status-updated",
        handleStatusUpdated
      );
    };
  }, []);

  const filteredAndSortedProviders = useMemo(() => {
    return [...providers]
      .filter((provider) => {
        const { short } = formatProviderDocumentType(provider.documentType);
        const matchesDocType =
          docTypeFilter === "ALL" || short === docTypeFilter;

        const isProviderActive = Boolean(
          provider.isActive ?? provider.providerStatus
        );
        const matchesStatus =
          statusFilter === "ALL" ||
          (statusFilter === "ACTIVE" && isProviderActive) ||
          (statusFilter === "INACTIVE" && !isProviderActive);

        return matchesDocType && matchesStatus;
      })
      .sort((a, b) =>
        String(a.fullName || "").localeCompare(String(b.fullName || ""), "es", {
          sensitivity: "base",
        })
      );
  }, [providers, docTypeFilter, statusFilter]);

  const hasActiveFilters = docTypeFilter !== "ALL" || statusFilter !== "ALL";

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-main font-[var(--font-heading)] text-[var(--color-text-inverse)]">
            Listado de Proveedores
          </h1>
          <p className="text-medium text-[var(--color-text-muted)]">
            Directorio de aliados comerciales y abastecimiento (orden alfabético A–Z)
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-start sm:justify-end gap-3">
          {canReport && (
            <Button
              variant="secondary"
              onClick={() => setIsReportModalOpen(true)}
            >
              <FileSpreadsheet className="w-4 h-4" />
              Reportar proveedores
            </Button>
          )}

          {canCreate && (
            <Link to="/dashboard/providerCreate">
              <Button variant="primary">
                <Plus className="w-4 h-4" />
                Crear proveedor
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="bg-[var(--color-background-inverse)] rounded-3xl border border-[var(--color-brand)]/50 shadow-2xl p-4 sm:p-6 md:p-8 space-y-5 overflow-hidden">
        {/* Barra de Filtros Rápidos */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[var(--color-border)]/60">
          <div className="flex items-center gap-2 text-small font-[var(--font-label)] text-[var(--color-brand)]">
            <Filter className="w-4 h-4" />
            <span>Filtros rápidos de proveedores:</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={docTypeFilter}
              onChange={(e) => setDocTypeFilter(e.target.value)}
              aria-label="Filtrar por tipo de documento"
              className="bg-[var(--color-surface-dark)] border border-[var(--color-border)] text-[var(--color-text-inverse)] rounded-xl px-3.5 py-2 text-small font-[var(--font-label)] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] transition"
            >
              <option value="ALL">Documento: Todos</option>
              <option value="NIT">Documento: NIT</option>
              <option value="CC">Documento: Cédula (CC)</option>
              <option value="CE">Documento: Extranjería (CE)</option>
              <option value="PEP">Documento: PEP</option>
              <option value="PAS">Documento: Pasaporte</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filtrar por estado"
              className="bg-[var(--color-surface-dark)] border border-[var(--color-border)] text-[var(--color-text-inverse)] rounded-xl px-3.5 py-2 text-small font-[var(--font-label)] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] transition"
            >
              <option value="ALL">Estado: Todos</option>
              <option value="ACTIVE">Estado: Activo</option>
              <option value="INACTIVE">Estado: Inactivo</option>
            </select>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={() => {
                  setDocTypeFilter("ALL");
                  setStatusFilter("ALL");
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-[var(--color-brand)] bg-[var(--color-brand)]/10 hover:bg-[var(--color-brand)]/20 border border-[var(--color-brand)]/30 transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Limpiar filtros
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <p className="text-[var(--color-text-inverse)] text-center py-8 text-body">
            Cargando proveedores de la base de datos...
          </p>
        ) : (
          <DataTable
            data={filteredAndSortedProviders}
            columns={providerColumns}
          />
        )}
      </div>

      <ReportConfigModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </section>
  );
}