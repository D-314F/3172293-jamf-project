// Función utilitaria para construir el dataset de un reporte (tabla)
// Patrón: transformación de datos (input -> output listo para exportar)
export function buildReportDataset(
  selectedFields, // Campos seleccionados para el reporte [{ key, label }]
  scope,          // Alcance del reporte: "all" o "category"
  category,       // Categoría para filtrar (si aplica)
  dishes          // Array de platillos origen
) {
  // Copia inmutable del array original (evita mutaciones)
  let filteredDishes = [...dishes];

  // Filtro por alcance: si es por categoría, se aplica filtro específico
  if (scope === "category" && category) {
    filteredDishes = filteredDishes.filter(
      (dish) => dish.category === category
    );
  }

  // Construcción de encabezados del reporte
  const headers = selectedFields.map((field) => field.label);

  // Construcción de filas del reporte
  const rows = filteredDishes.map((dish) =>
    selectedFields.map((field) => {
      const value = dish[field.key]; // acceso dinámico a la propiedad

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
