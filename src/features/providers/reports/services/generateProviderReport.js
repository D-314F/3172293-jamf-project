// Fuente de datos de proveedores
import { providers } from "../../data/providers";

// Servicios de exportación
import { generateExcelReport } from "./generateExcelReport";
import { generatePdfReport } from "./generatePdfReport";

// Caso de uso: orquestador de generación de reportes de proveedores
export function generateProviderReport({
  format,          // "excel" | "pdf"
  selectedFields,  // Campos seleccionados por el usuario
  scope,           // Alcance del reporte
  documentType,    // Filtro opcional por tipo de documento
}) {
  // Filtrar dataset según alcance
  let filteredData = providers;
  if (scope === "documentType" && documentType) {
    filteredData = providers.filter(
      (provider) => provider.documentType === documentType
    );
  }

  // Construcción del dataset con solo los campos seleccionados
  const headers = selectedFields.map((f) => f.label);
  const rows = filteredData.map((provider) =>
    selectedFields.map((f) => provider[f.key])
  );

  // Validación: evita generar archivos vacíos
  if (!rows.length) {
    alert("No hay datos para generar el reporte.");
    return;
  }

  // Generación de timestamp para nombres únicos de archivo
  const timestamp = new Date().toISOString().slice(0, 10);

  // Selección de estrategia de exportación según formato
  if (format === "excel") {
    generateExcelReport({
      headers,
      rows,
      fileName: `providers-report-${timestamp}.xlsx`,
    });
  }
  if (format === "pdf") {
    generatePdfReport({
      headers,
      rows,
      fileName: `providers-report-${timestamp}.pdf`,
    });
  }
}
