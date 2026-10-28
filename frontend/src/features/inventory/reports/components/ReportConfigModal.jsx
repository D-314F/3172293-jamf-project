import { ReportModal } from "@/shared";
import {
  inventoryReportFields,
  inventoryReportFormats,
  inventoryReportScopes,
  inventoryReportFilters,
} from "../config/inventoryReportFields";
import { generateInventoryReport } from "../services/generateInventoryReport";

export default function ReportConfigModal({ isOpen, onClose }) {
  return (
    <ReportModal
      isOpen={isOpen}
      onClose={onClose}
      title="Generar reporte de inventario"
      successTitle="Reporte de inventario generado"
      fields={inventoryReportFields}
      formatOptions={inventoryReportFormats}
      scopeOptions={inventoryReportScopes}
      filterConfigMap={inventoryReportFilters}
      onGenerate={({ format, selectedFields, scope, filterValue }) =>
        generateInventoryReport({
          format,
          selectedFields,
          scope,
          category: filterValue,
        })
      }
    />
  );
}