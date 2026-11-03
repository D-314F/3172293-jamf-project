// src/features/providers/reports/services/generateProviderReport.js
import { getProviders } from "../../services/providerServices";
import { generateExcelReport } from "./generateExcelReport";
import { generatePdfReport } from "./generatePdfReport";

export async function generateProviderReport({
  format,          // "excel" | "pdf"
  selectedFields,  // Campos seleccionados
  scope,           // Alcance
  documentType,    // Filtro por tipo de documento
}) {
  try {
    // 1. Obtener datos reales de PostgreSQL
    const providersData = await getProviders();

    // 2. Filtrar si se solicitó por tipo de documento
    let filteredData = [...providersData];
    if (scope === "documentType" && documentType) {
      const docLower = documentType.toLowerCase().trim();
      filteredData = filteredData.filter((p) =>
        (p.documentType && p.documentType.toLowerCase().includes(docLower)) ||
        (p.providerDocumentType && p.providerDocumentType.toLowerCase().includes(docLower))
      );
    }

    if (!filteredData.length) {
      alert("No hay proveedores que coincidan con el filtro.");
      return;
    }

    // 3. Encabezados y Filas
    const headers = selectedFields.map((f) => f.label);
    const rows = filteredData.map((provider) =>
      selectedFields.map((f) => {
        const val = provider[f.key];
        if (typeof val === "boolean") return val ? "Activo" : "Inactivo";
        return val ?? "";
      })
    );

    const timestamp = new Date().toISOString().slice(0, 10);

    if (format === "excel") {
      generateExcelReport({
        headers,
        rows,
        fileName: `reporte-proveedores-${timestamp}.xlsx`,
      });
    }

    if (format === "pdf") {
      generatePdfReport({
        headers,
        rows,
        fileName: `reporte-proveedores-${timestamp}.pdf`,
      });
    }
  } catch (error) {
    console.error("Error al generar reporte de proveedores:", error);
    alert("Ocurrió un error al obtener los datos de proveedores.");
  }
}