import { ReportModal } from "@/shared";
import {
  dishReportFields,
  dishReportFormats,
  dishReportScopes,
  dishReportFilters,
} from "../config/dishReportFields";
import { generateDishReport } from "../services/generateDishReport";

export default function ReportConfigModal({ isOpen, onClose }) {
  return (
    <ReportModal
      isOpen={isOpen}
      onClose={onClose}
      title="Generar reporte de platillos"
      successTitle="Reporte de platillos generado"
      fields={dishReportFields}
      formatOptions={dishReportFormats}
      scopeOptions={dishReportScopes}
      filterConfigMap={dishReportFilters}
      onGenerate={({ format, selectedFields, scope, filterValue }) =>
        generateDishReport({ format, selectedFields, scope, category: filterValue })
      }
    />
  );
}