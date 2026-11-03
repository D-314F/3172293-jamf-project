import StatusSwitch from "@/shared/components/StatusSwitch";
import ProviderRowActions from "../components/ProviderRowActions";
import { updateProvider } from "../services/providerServices";

export const providerColumns = [
  { accessorKey: "id", header: "Id" },
  { accessorKey: "fullName", header: "Nombre completo" },
  { accessorKey: "userType", header: "Tipo de usuario" },
  { accessorKey: "documentType", header: "Tipo de documento" },
  { accessorKey: "email", header: "Correo electrónico" },

  // Columna Estado con Switch conectado a BD
  {
    accessorKey: "accountStatus",
    header: "Estado",
    cell: ({ row }) => {
      const provider = row.original;

      const handleChange = async (value) => {
        await updateProvider(provider.id, { providerStatus: value });
        provider.providerStatus = value;
        provider.accountStatus = value ? "Activo" : "Inactivo";
      };

      return (
        <StatusSwitch
          checked={Boolean(provider.providerStatus ?? provider.accountStatus === "Activo")}
          onChange={handleChange}
          itemName={`al proveedor "${provider.fullName || provider.providerName}"`}
        />
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => <ProviderRowActions provider={row.original} />,
  },
];