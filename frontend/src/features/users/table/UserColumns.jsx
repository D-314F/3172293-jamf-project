import StatusSwitch from "@/shared/components/StatusSwitch";
import UserRowActions from "@/features/users/components/UserRowActions";
import { updateUser } from "../services/userServices";

export const UserColumns = [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "userName",
    header: "Nombre",
  },
  {
    accessorKey: "userEmail",
    header: "Email",
  },
  {
    accessorKey: "userPhone",
    header: "Telefono",
  },
  {
    accessorKey: "userRole",
    header: "Rol",
  },
  {
    accessorKey: "isActive",
    header: "Estado",
    cell: ({ row }) => {
      const user = row.original;

      const handleChange = async (value) => {
        await updateUser(user.id, { isActive: value });
        user.isActive = value;
      };

      return (
        <StatusSwitch
          checked={Boolean(user.isActive ?? user.is_active)}
          onChange={handleChange}
          itemName={`al usuario "${user.userName}"`}
        />
      );
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => <UserRowActions user={row.original} />,
  },
];