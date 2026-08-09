import { useState } from "react";
import { DataTable, Button } from "@/shared";
import { UserColumns } from "../table/UserColumns";
import { users } from "../data/users";
import { Link } from "react-router-dom";
import ReportConfigModal from "../reports/components/ReportConfigModal";

export default function UserListPage() {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-20 md:pt-28 pb-10">
      
      {/* Header Responsivo */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-text-inverse)]">
          Listado de Usuarios
        </h1>

        <div className="flex flex-wrap items-center justify-start sm:justify-end gap-3">
          <Button 
            variant="secondary"
            onClick={() => setIsReportModalOpen(true)}
          >
            Reportar usuario
          </Button>

          <Link to="/dashboard/userCreate">
            <Button variant="primary">
              Crear usuario
            </Button>
          </Link>
        </div>
      </div>

      {/* TARJETA CONTENEDORA */}
      <div className="bg-[var(--color-background-inverse)] rounded-2xl md:rounded-3xl border border-[var(--color-brand)] shadow-2xl p-4 sm:p-6 md:p-8 overflow-hidden">
        <DataTable data={users} columns={UserColumns} />
      </div>

      {/* Modal de Reporte */}
      <ReportConfigModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </section>
  );
}