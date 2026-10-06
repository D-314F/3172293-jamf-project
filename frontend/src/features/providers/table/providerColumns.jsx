import ProviderRowActions from "../components/ProviderRowActions";

export const providerColumns = [
  { accessorKey: "id", header: "Id" },
  { accessorKey: "fullName", header: "Nombre completo" },
  { accessorKey: "userType", header: "Tipo de usuario" },
  { accessorKey: "documentType", header: "Tipo de documento" },
  { accessorKey: "email", header: "Correo electrónico" },
  { accessorKey: "accountStatus", header: "Estado de cuenta" },

  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => <ProviderRowActions provider={row.original} />,
  },
];
