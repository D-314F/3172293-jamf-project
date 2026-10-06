import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function generatePdfReport({
headers,
rows,
fileName = "reporte-ordenes.pdf",
}) {
const doc = new jsPDF();

// Título
doc.setFontSize(16);
doc.text("Reporte de Órdenes", 14, 20);

// Subtítulo con fecha y hora de generación
doc.setFontSize(10);
doc.setTextColor(100);
// ESTO SIRVE PARA GENERAR FEHCA DENTRO DEL DOCUMENTO PDF
doc.text(`Fecha y Hora de Generación: ${new Date().toLocaleString()}`, 14, 26);

// Tabla idéntica al estilo de Users
autoTable(doc, {
    startY: 32,
    head: [headers],
    body: rows,
    theme: "grid", // Mismo estilo con cuadrícula que Users
    headStyles: {
    fillColor: [33, 150, 243], // Mismo azul de Users
    textColor: 255,
    fontSize: 11,
    },
    styles: {
    fontSize: 10,
    },
    margin: {
    left: 14,
    right: 14,
    },
});

doc.save(fileName);
}