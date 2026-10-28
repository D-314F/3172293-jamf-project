import { ReportModal } from "@/shared";
import {
  providerReportFields,
  providerReportFormats,
  providerReportScopes,
  providerReportFilters,
} from "../config/providerReportFields";
import { generateProviderReport } from "../services/generateProviderReport";

export default function ReportConfigModal({ isOpen, onClose }) {
  return (
    <ReportModal
      isOpen={isOpen}
      onClose={onClose}
      title="Generar reporte de proveedores"
      successTitle="Reporte de proveedores generado"
      fields={providerReportFields}
      formatOptions={providerReportFormats}
      scopeOptions={providerReportScopes}
      filterConfigMap={providerReportFilters}
      onGenerate={({ format, selectedFields, scope, filterValue }) =>
        generateProviderReport({
          format,
          selectedFields,
          scope,
          documentType: filterValue,
        })
      }
    />
  );
}