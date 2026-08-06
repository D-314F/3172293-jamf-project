// Fuente de datos de platillos
import { dishes } from "../../data/dishes";

// Servicios de exportación
import { generateExcelReport } from "./generateExcelReport";
import { generatePdfReport } from "./generatePdfReport";

// Caso de uso: orquestador de generación de reportes de platillos
export function generateDishReport({
  format,          // "excel" | "pdf"
  selectedFields,  // Campos seleccionados por el usuario
  scope,           // Alcance del reporte
  category,        // Filtro opcional por categoría
}) {
  // Filtrar dataset según alcance
  let filteredData = dishes;
  if (scope === "category" && category) {
    filteredData = dishes.filter((dish) => dish.category === category);
  }

  // Construcción del dataset con solo los campos seleccionados
  const headers = selectedFields.map((f) => f.label);
  const rows = filteredData.map((dish) =>
    selectedFields.map((f) => dish[f.key])
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
      fileName: `dishes-report-${timestamp}.xlsx`,
    });
  }
  if (format === "pdf") {
    generatePdfReport({
      headers,
      rows,
      fileName: `dishes-report-${timestamp}.pdf`,
    });
  }
}
