// src/features/users/reports/services/generateUserReport.js
import { getUsers } from "../../services/userServices";
import { buildReportDataset } from "../utils/buildReportDataset";
import { generateExcelReport } from "./generateExcelReport";
import { generatePdfReport } from "./generatePdfReport";

export async function generateUserReport({
  format,
  selectedFields,
  scope,
  documentNumber,
}) {
  try {
    // 1. Obtener usuarios de PostgreSQL
    const usersData = await getUsers();

    // 2. Construir dataset
    const { headers, rows } = buildReportDataset({
      users: usersData,
      selectedFields,
      scope,
      documentNumber,
    });

    if (!rows.length) {
      alert("No hay usuarios que coincidan con el filtro.");
      return;
    }

    const timestamp = new Date().toISOString().slice(0, 10);

    if (format === "excel") {
      generateExcelReport({
        headers,
        rows,
        fileName: `reporte-usuarios-${timestamp}.xlsx`,
      });
    }

    if (format === "pdf") {
      generatePdfReport({
        headers,
        rows,
        fileName: `reporte-usuarios-${timestamp}.pdf`,
      });
    }
  } catch (error) {
    console.error("Error al generar reporte de usuarios:", error);
    alert("Ocurrió un error al obtener los usuarios de la base de datos.");
  }
}