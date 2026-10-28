// Campos disponibles para el reporte de proveedores
export const providerReportFields = [
  { key: "fullName", label: "Nombre completo", default: true },
  { key: "userType", label: "Tipo de usuario", default: true },
  { key: "documentType", label: "Tipo de documento", default: true },
  { key: "email", label: "Correo electrónico", default: true },
  { key: "accountStatus", label: "Estado de cuenta", default: false },
];

export const providerReportFormats = [
  { label: "PDF (.pdf)", value: "pdf" },
  { label: "Excel (.xlsx)", value: "excel" },
];

export const providerReportScopes = [
  { label: "Todos los proveedores", value: "all" },
  { label: "Filtrar por tipo de documento", value: "documentType" },
];

export const providerReportFilters = {
  documentType: {
    label: "Tipo de documento",
    placeholder: "Ej: NIT, Cédula de ciudadanía",
    emptyError: "Por favor ingresa un tipo de documento válido.",
  },
};