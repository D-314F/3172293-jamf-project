// Función utilitaria para construir el dataset de un reporte (tabla)
// Patrón: transformación de datos (input -> output listo para exportar)
export function buildReportDataset(
  selectedFields,   // Campos seleccionados para el reporte [{ key, label }]
  scope,            // Alcance del reporte: "all" o "documentType"
  documentType,     // Tipo de documento para filtrar (si aplica)
  providers         // Array de proveedores origen
) {
  // Copia inmutable del array original (evita mutaciones)
  let filteredProviders = [...providers];

  // Filtro por alcance: si es por tipo de documento, se aplica filtro específico
  if (scope === "documentType" && documentType) {
    filteredProviders = filteredProviders.filter(
      (provider) => provider.documentType === documentType
    );
  }

  // Construcción de encabezados del reporte
  const headers = selectedFields.map((field) => field.label);

  // Construcción de filas del reporte
  const rows = filteredProviders.map((provider) =>
    selectedFields.map((field) => {
      const value = provider[field.key]; // acceso dinámico a la propiedad

      // Normalización: convierte booleanos a texto legible
      if (typeof value === "boolean") {
        return value ? "Sí" : "No";
      }

      // Normalización: evita undefined o null en el reporte
      return value ?? "";
    })
  );

  // Lista para exportar a Excel, PDF o renderizar en tabla
  return {
    headers, // Array de strings (columnas)
    rows,    // Array de arrays (filas)
  };
}
