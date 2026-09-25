import { INITIAL_ORDERS } from "../../data/ordersData";
import { buildReportDataset } from "../utils/buildReportDataset";
import { generateExcelReport } from "./generateExcelReport";
import { generatePdfReport } from "./generatePdfReport";

export function generateOrderReport({
format,
selectedFields = [],
scope,
filterValue,
}) {
// Construir el dataset pasando los datos al helper utils
const { headers, rows } = buildReportDataset({
orders: INITIAL_ORDERS,
selectedFields,
scope,
filterValue,
});

if (!rows || rows.length === 0) {
alert("No se encontraron órdenes para generar el reporte.");
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
}