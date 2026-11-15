// Reemplaza todo: frontend/src/features/dishes/reports/services/generateDishReport.js
import { getDishes } from "../../services/dishServices";
import { generateExcelReport } from "./generateExcelReport";
import { generatePdfReport } from "./generatePdfReport";
import { showUserErrorAlert } from "@/shared/services/alertService";

function downloadCsv({ headers, rows, fileName }) {
  const escape = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csvContent = [headers, ...rows]
    .map((row) => row.map(escape).join(","))
    .join("\n");
  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

export async function generateDishReport({
  format,
  selectedFields,
  scope,
  category,
}) {
  try {
    const dishesData = await getDishes();

    let filteredData = [...dishesData];
    if (scope === "category" && category) {
      const catLower = category.toLowerCase().trim();
      filteredData = filteredData.filter(
        (dish) => dish.category && dish.category.toLowerCase().includes(catLower)
      );
    } else if (scope === "active") {
      filteredData = filteredData.filter((dish) => dish.isActive);
    }

    if (!filteredData.length) {
      await showUserErrorAlert({
        title: "Sin coincidencias",
        text: "No hay platillos que coincidan con el filtro.",
      });
      return false;
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
    } else if (format === "pdf") {
      generatePdfReport({
        headers,
        rows,
        fileName: `reporte-platillos-${timestamp}.pdf`,
      });
    } else if (format === "csv") {
      downloadCsv({
        headers,
        rows,
        fileName: `reporte-platillos-${timestamp}.csv`,
      });
    }

    return true;
  } catch (error) {
    console.error("Error al generar reporte de platillos:", error);
    await showUserErrorAlert({
      title: "Error al generar reporte",
      text: "Ocurrió un error al obtener los platillos de la base de datos.",
    });
    return false;
  }
}