import StatusSwitch from "@/shared/components/StatusSwitch";
import ProviderRowActions from "../components/ProviderRowActions";

export const providerColumns = [
  { accessorKey: "id", header: "Id" },
  { accessorKey: "fullName", header: "Nombre completo" },
  { accessorKey: "userType", header: "Tipo de usuario" },
  { accessorKey: "documentType", header: "Tipo de documento" },
  { accessorKey: "email", header: "Correo electrónico" },

  // Columna Estado de cuenta con Switch M3
  {
    accessorKey: "accountStatus",
    header: "Estado de cuenta",
    cell: ({ row }) => {
      const provider = row.original;

      const handleChange = (value) => {
        console.log("Actualizar estado proveedor:", provider.id, value);
        // Aquí se conectará la API o función de actualización
      };

      return (
        <StatusSwitch
          checked={
            provider.accountStatus === "Activo" ||
            provider.accountStatus === true
          }
          onChange={handleChange}
        />
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => <ProviderRowActions provider={row.original} />,
  },
];