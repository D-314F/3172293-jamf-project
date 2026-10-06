// src/features/inventory/reports/services/generateInventoryReport.js
import { inventory } from "../../data/inventory";
import { generateExcelReport } from "./generateExcelReport";
import { generatePdfReport } from "./generatePdfReport";

export function generateInventoryReport({
  format,          // "excel" | "pdf"
  selectedFields,  // Campos seleccionados
  scope,           // Alcance del reporte
  category,        // Filtro opcional por categoría
}) {
  let filteredData = inventory;
  if (scope === "category" && category) {
    filteredData = inventory.filter((item) => item.category === category);
  }

  const headers = selectedFields.map((f) => f.label);
  const rows = filteredData.map((item) =>
    selectedFields.map((f) => item[f.key])
  );

  if (!rows.length) {
    alert("No hay datos para generar el reporte.");
    return;
  }

  const timestamp = new Date().toISOString().slice(0, 10);

  if (format === "excel") {
    generateExcelReport({
      headers,
      rows,
      fileName: `inventory-report-${timestamp}.xlsx`,
    });
  }
  if (format === "pdf") {
    generatePdfReport({
      headers,
      rows,
      fileName: `inventory-report-${timestamp}.pdf`,
    });
  }
}
