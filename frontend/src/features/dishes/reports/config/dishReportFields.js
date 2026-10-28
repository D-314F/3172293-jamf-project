// Campos disponibles para el reporte de platillos
export const dishReportFields = [
  { key: "dishName", label: "Nombre del platillo", default: true },
  { key: "category", label: "Categoría", default: true },
  { key: "price", label: "Precio", default: true },
  { key: "status", label: "Estado", default: false },
  { key: "description", label: "Descripción", default: false },
];

export const dishReportFormats = [
  { label: "PDF (.pdf)", value: "pdf" },
  { label: "Excel (.xlsx)", value: "excel" },
  { label: "CSV (.csv)", value: "csv" },
];

export const dishReportScopes = [
  { label: "Todos los platillos", value: "all" },
  { label: "Solo platillos activos", value: "active" },
  { label: "Filtrar por categoría", value: "category" },
];

export const dishReportFilters = {
  category: {
    label: "Categoría",
    placeholder: "Ej: Postres, Bebidas...",
    emptyError: "Por favor ingresa una categoría válida.",
  },
};