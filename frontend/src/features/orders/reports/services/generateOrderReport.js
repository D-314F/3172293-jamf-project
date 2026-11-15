// Reemplaza todo: frontend/src/features/orders/reports/services/generateOrderReport.js
import { getOrders } from "../../services/orderServices";
import { buildReportDataset } from "../utils/buildReportDataset";
import { generateExcelReport } from "./generateExcelReport";
import { generatePdfReport } from "./generatePdfReport";
import { showUserErrorAlert } from "@/shared/services/alertService";

export async function generateOrderReport({
  format,
  selectedFields = [],
  scope,
  filterValue,
}) {
  try {
    const ordersData = await getOrders();

    const { headers, rows } = buildReportDataset({
      orders: Array.isArray(ordersData) ? ordersData : [],
      selectedFields,
      scope,
      filterValue,
    });

    if (!rows || rows.length === 0) {
      await showUserErrorAlert({
        title: "Sin coincidencias",
        text: "No se encontraron órdenes con el filtro seleccionado.",
      });
      return false;
    }

    const timestamp = new Date().toISOString().slice(0, 10);

    if (format === "excel") {
      generateExcelReport({
        headers,
        rows,
        fileName: `reporte-ordenes-${timestamp}.xlsx`,
      });
    } else if (format === "pdf") {
      generatePdfReport({
        headers,
        rows,
        fileName: `reporte-ordenes-${timestamp}.pdf`,
      });
    }

    return true;
  } catch (error) {
    console.error("Error al generar reporte de órdenes:", error);
    await showUserErrorAlert({
      title: "Error al generar reporte",
      text: "No se pudieron obtener las órdenes de la base de datos.",
    });
    return false;
  }
}