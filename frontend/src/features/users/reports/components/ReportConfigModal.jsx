import { ReportModal } from "@/shared";
import {
  userReportFields,
  userReportFormats,
  userReportScopes,
  userReportFilters,
} from "../config/userReportFields";
import { generateUserReport } from "../services/generateUserReport";

export default function ReportConfigModal({ isOpen, onClose }) {
  return (
    <ReportModal
      isOpen={isOpen}
      onClose={onClose}
      title="Generar reporte de usuarios"
      successTitle="Reporte de usuarios generado"
      fields={userReportFields}
      formatOptions={userReportFormats}
      scopeOptions={userReportScopes}
      filterConfigMap={userReportFilters}
      onGenerate={({ format, selectedFields, scope, filterValue }) =>
        generateUserReport({
          format,
          selectedFields,
          scope,
          documentNumber: filterValue,
        })
      }
    />
  );
}