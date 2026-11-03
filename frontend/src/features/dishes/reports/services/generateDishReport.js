// src/features/dishes/reports/services/generateDishReport.js
import { getDishes } from "../../services/dishServices";
import { generateExcelReport } from "./generateExcelReport";
import { generatePdfReport } from "./generatePdfReport";

export async function generateDishReport({
  format,
  selectedFields,
  scope,
  category,
}) {
  try {
    // 1. Obtener platillos de PostgreSQL
    const dishesData = await getDishes();

    // 2. Filtrar por categoría o activos si aplica
    let filteredData = [...dishesData];
    if (scope === "category" && category) {
      const catLower = category.toLowerCase().trim();
      filteredData = filteredData.filter((dish) =>
        dish.category && dish.category.toLowerCase().includes(catLower)
      );
    } else if (scope === "active") {
      filteredData = filteredData.filter((dish) => dish.isActive);
    }

    if (!filteredData.length) {
      alert("No hay platillos que coincidan con el filtro.");
      return;
    }

    const headers = selectedFields.map((f) => f.label);
    const rows = filteredData.map((dish) =>
      selectedFields.map((f) => {
        const val = dish[f.key];
        if (typeof val === "boolean") return val ? "Habilitado" : "Deshabilitado";
        return val ?? "";
      })
    );

    const timestamp = new Date().toISOString().slice(0, 10);

    if (format === "excel") {
      generateExcelReport({
        headers,
        rows,
        fileName: `reporte-platillos-${timestamp}.xlsx`,
      });
    }

    if (format === "pdf") {
      generatePdfReport({
        headers,
        rows,
        fileName: `reporte-platillos-${timestamp}.pdf`,
      });
    }
  } catch (error) {
    console.error("Error al generar reporte de platillos:", error);
    alert("Ocurrió un error al obtener los platillos de la base de datos.");
  }
}