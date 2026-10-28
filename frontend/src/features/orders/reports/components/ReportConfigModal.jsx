import { ReportModal } from "@/shared";
import {
	orderReportFields,
	orderReportFormats,
	orderReportScopes,
	orderReportFilters,
} from "../config/orderReportFields";
import { generateOrderReport } from "../services/generateOrderReport";

export default function ReportConfigModal({ isOpen, onClose }) {
	return (
		<ReportModal
			isOpen={isOpen}
			onClose={onClose}
			title="Generar reporte de órdenes"
			successTitle="Reporte de órdenes generado"
			fields={orderReportFields}
			formatOptions={orderReportFormats}
			scopeOptions={orderReportScopes}
			filterConfigMap={orderReportFilters}
			onGenerate={({ format, selectedFields, scope, filterValue }) =>
				generateOrderReport({ format, selectedFields, scope, filterValue })
			}
		/>
	);
}