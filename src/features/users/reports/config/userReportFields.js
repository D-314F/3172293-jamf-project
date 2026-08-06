// Configuracion de campos disponibles para el reporte de usuarios
// Cada objeto representa una columna que el usuario puede incluir o excluir
export const userReportFields = [
  {
    key: "userName",
    label: "Nombre",
    default: true,
  },
  {
    key: "userEmail",
    label: "Email",
    default: true,
  },
  {
    key: "userDocumentTypes",
    label: "Tipo de documento",
    default: true,
  },
  {
    key: "userDocumentNumber",
    label: "Documento",
    default: true,
  },
  {
    key: "userPhone",
    label: "Telefono",
    default: false,
  },
  {
    key: "isActive",
    label: "Activo",
    default: false,
  },
];
