import UserStatusCell from "@/features/users/components/UserStatusCell";
import UserRowActions from "@/features/users/components/UserRowActions";

const normalizeDocBadge = (rawValue) => {
  const val = String(rawValue || "cc")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (val === "cc" || val.includes("ciudadania")) return "CC";
  if (val === "ti" || val.includes("identidad")) return "TI";
  if (val === "ce" || val.includes("extranjeria")) return "CE";
  if (val === "pep" || val.includes("permiso")) return "PEP";
  if (val === "nit" || val.includes("tributaria")) return "NIT";
  if (val === "pasaporte" || val === "pas") return "PAS";
  return val.toUpperCase();
};

export const getUserColumns = ({ canView = true, canEdit = true } = {}) => [
  {
    accessorKey: "userName",
    header: "Nombre completo",
    cell: ({ row }) => (
      <span className="font-medium text-[var(--color-text-inverse)]">
        {row.original.userName}
      </span>
    ),
  },
  {
    accessorKey: "userDocumentNumber",
    header: "Documento",
    cell: ({ row }) => {
      const shortType = normalizeDocBadge(row.original.userDocumentTypes);
      const number = row.original.userDocumentNumber || "Sin registrar";

      return (
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-[var(--color-brand)]/15 text-[var(--color-brand)] border border-[var(--color-brand)]/30">
            {shortType}
          </span>
          <span>{number}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "userRole",
    header: "Tipo de usuario",
    cell: ({ row }) => (
      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--color-surface-hover)] text-[var(--color-text-inverse)] border border-[var(--color-border)]">
        {row.original.userRole || "Pendiente"}
      </span>
    ),
  },
  {
    accessorKey: "userEmail",
    header: "Correo personal",
  },
  {
    accessorKey: "userPhone",
    header: "Teléfono",
  },
  {
    accessorKey: "isActive",
    header: "Estado",
    cell: ({ row }) => (
      <UserStatusCell
        key={`status-${row.original.id}`}
        user={row.original}
        canEdit={canEdit}
      />
    ),
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => (
      <UserRowActions
        user={row.original}
        canView={canView}
        canEdit={canEdit}
      />
    ),
  },
];

export const UserColumns = getUserColumns();
