import StatusSwitch from "@/shared/components/StatusSwitch";
import DishRowActions from "@/features/dishes/components/dishRowActions";
import userProfile from "@/assets/images/user-profile.png"; // 👈 usamos la imagen de usuario

export const dishColumns = [
  {
    accessorKey: "thumbnail",
    header: "Imagen",
    cell: ({ row }) => {
      const dish = row.original;
      return (
        <img
          src={userProfile} // 👈 temporal, luego será dish.dishImage
          alt={dish.dishName}
          className="w-12 h-12 object-cover rounded-md border border-[var(--color-border)]"
        />
      );
    },
  },
  {
    accessorKey: "dishName",
    header: "Nombre del platillo",
  },
  {
    accessorKey: "category",
    header: "Categoría",
  },
  {
    accessorKey: "price",
    header: "Precio",
  },
  {
    accessorKey: "description",
    header: "Descripción",
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const dish = row.original;

      const handleChange = (value) => {
        console.log("Actualizar estado platillo:", dish.id, value);
        // Aquí normalmente se llamaría una API para actualizar el estado
      };

      return (
        <StatusSwitch
          checked={dish.status === "Habilitado"}
          onChange={handleChange}
        />
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DishRowActions dish={row.original} />,
  },
];
