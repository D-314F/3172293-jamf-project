// src/features/inventory/pages/InventoryListPage.jsx
import { useState } from "react";
import { DataTable, Button } from "@/shared";
import { inventoryColumns } from "../table/inventoryColumns";
import { inventory } from "../data/inventory";
import { Link } from "react-router-dom";
import ReportConfigModal from "../reports/components/ReportConfigModal";

export default function InventoryListPage() {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  return (
    <div className="p-6">
      <h1 className="text-xl text-white font-semibold mb-4">
        Listado de Inventario
      </h1>

      <div className="flex justify-end items-center gap-4">
        <Button onClick={() => setIsReportModalOpen(true)}>
          Reportar inventario
        </Button>

        <Link to="/dashboard/createInventory" className="text-h1 font-heading">
          <Button>Crear inventario</Button>
        </Link>
      </div>

      <DataTable data={inventory} columns={inventoryColumns} />

      <ReportConfigModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
}
