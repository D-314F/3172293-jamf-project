// Libreria para generacion de PDFs en el cliente
import jsPDF from "jspdf";

// Plugin para creacion de tablas dentro del PDF
import autoTable from "jspdf-autotable";

// Funcion utilitaria para generar un reporte en PDF
// Patron: exportacion de datos (dataset -> documento estructurado)
export function generatePdfReport({
  headers, // Encabezados de la tabla (columnas)
  rows, // Datos (array de filas)
  fileName = "user-report.pdf", // Nombre del archivo de salida
}) {
  // Inicializa el documento PDF
  const doc = new jsPDF();

  // Configuracion del titulo
  doc.setFontSize(16);
  doc.text("Reporte de Productos", 14, 20); // Posicion (x, y)

  // Subtítulo con fecha y hora de generación
  doc.setFontSize(10);
  doc.setTextColor(100);
  // ESTO SIRVE PARA GENERAR FEHCA DENTRO DEL DOCUMENTO PDF
  doc.text(`Fecha y Hora de Generación: ${new Date().toLocaleString()}`, 14, 26);

  // Generacion de tabla automatica
  autoTable(doc, {
    startY: 30, // Posicion inicial debajo del titulo
    head: [headers], // Encabezados (debe ser array de arrays)
    body: rows, // Filas del reporte
    theme: "grid", // Estilo visual de la tabla

    // Estilos del encabezado
    headStyles: {
      fillColor: [33, 150, 243], // Color de fondo (RGB)
      textColor: 255, // Color del texto
      fontSize: 11,
    },

    // Estilos globales de las celdas
    styles: {
      fontSize: 10,
    },

    // Margenes del documento
    margin: {
      left: 14,
      right: 14,
    },
  });

  // Genera y descarga el archivo PDF
  doc.save(fileName);
}
