// src/features/inventory/reports/services/generateInventoryReport.js
import { getInventory } from "../../services/inventoryServices";
import { generateExcelReport } from "./generateExcelReport";
import { generatePdfReport } from "./generatePdfReport";

export async function generateInventoryReport({
  format,          // "excel" | "pdf"
  selectedFields,  // Campos seleccionados
  scope,           // Alcance del reporte
  category,        // Filtro opcional por categoría o marca
}) {
  try {
    // 1. Obtener datos reales de PostgreSQL
    const inventoryData = await getInventory();

    // 2. Filtrar según el alcance seleccionado
    let filteredData = [...inventoryData];
    if (scope === "category" && category) {
      const catLower = category.toLowerCase().trim();
      filteredData = filteredData.filter((item) =>
        (item.brand && item.brand.toLowerCase().includes(catLower)) ||
        (item.marca && item.marca.toLowerCase().includes(catLower)) ||
        (item.category && item.category.toLowerCase().includes(catLower))
      );
    }

    if (!filteredData.length) {
      alert("No hay productos que coincidan con el filtro.");
      return;
    }

    // 3. Encabezados y Filas dinámicas
    const headers = selectedFields.map((f) => f.label);
    const rows = filteredData.map((item) =>
      selectedFields.map((f) => {
        const val = item[f.key];
        if (typeof val === "boolean") return val ? "Activo" : "Inactivo";
        return val ?? "";
      })
    );

    const timestamp = new Date().toISOString().slice(0, 10);

    // 4. Exportar según formato
    if (format === "excel") {
      generateExcelReport({
        headers,
        rows,
        fileName: `reporte-inventario-${timestamp}.xlsx`,
      });
    }

    if (format === "pdf") {
      generatePdfReport({
        headers,
        rows,
        fileName: `reporte-inventario-${timestamp}.pdf`,
      });
    }
  } catch (error) {
    console.error("Error al generar reporte de inventario:", error);
    alert("Ocurrió un error al obtener los datos de inventario.");
  }
}