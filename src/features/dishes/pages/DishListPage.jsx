// src/features/dishes/pages/DishListPage.js

import { useState } from "react";
import { DataTable, Button } from "@/shared";
import { dishColumns } from "../table/dishColumns";
import { dishes } from "../data/dishes";
import { Link } from "react-router-dom";
import ReportConfigModal from "../reports/components/ReportConfigModal";

export default function DishListPage() {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  return (
    <div className="p-6">
      <h1 className="text-xl text-white font-semibold mb-4">
        Listado de Platillos
      </h1>

      <div className="flex justify-end items-center gap-4">
        <Button onClick={() => setIsReportModalOpen(true)}>
          Reportar platillo
        </Button>

        <Link to="/dashboard/dishCreate" className="text-h1 font-heading">
          <Button>Crear platillo</Button>
        </Link>
      </div>

      <DataTable data={dishes} columns={dishColumns} />

      <ReportConfigModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
}
