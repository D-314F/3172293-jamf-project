import { useState } from "react";
import { DataTable, Button } from "@/shared";
import { providerColumns } from "../table/providerColumns";
import { providers } from "../data/providers";
import { Link } from "react-router-dom";
import ReportConfigModal from "../reports/components/ReportConfigModal";

export default function ProviderListPage() {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  return (
    <div className="p-6">
      <h1 className="text-xl text-white font-semibold mb-4">
        Listado de Proveedores
      </h1>

      <div className="flex justify-end items-center gap-4">
        <Button onClick={() => setIsReportModalOpen(true)}>
          Reportar proveedor
        </Button>

        <Link to="/dashboard/providerCreate" className="text-h1 font-heading">
          <Button>Crear proveedor</Button>
        </Link>
      </div>

      <DataTable data={providers} columns={providerColumns} />

      <ReportConfigModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
}
