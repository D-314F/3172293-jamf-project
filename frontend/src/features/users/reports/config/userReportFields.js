// Configuracion de campos disponibles para el reporte de usuarios
export const userReportFields = [
  { key: "userName", label: "Nombre", default: true },
  { key: "userEmail", label: "Email", default: true },
  { key: "userDocumentTypes", label: "Tipo de documento", default: true },
  { key: "userDocumentNumber", label: "Documento", default: true },
  { key: "userPhone", label: "Telefono", default: false },
  { key: "isActive", label: "Activo", default: false },
];

export const userReportFormats = [
  { label: "PDF (.pdf)", value: "pdf" },
  { label: "Excel (.xlsx)", value: "excel" },
  { label: "CSV (.csv)", value: "csv" },
];

export const userReportScopes = [
  { label: "Todos los usuarios", value: "all" },
  { label: "Solo usuarios activos", value: "active" },
  { label: "Filtrar por documento", value: "document" },
];

export const userReportFilters = {
  document: {
    label: "Número de documento",
    placeholder: "Ingrese número de documento",
    emptyError: "Por favor ingresa un número de documento válido.",
  },
};