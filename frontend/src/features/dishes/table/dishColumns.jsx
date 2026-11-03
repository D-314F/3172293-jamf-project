import StatusSwitch from "@/shared/components/StatusSwitch";
import DishRowActions from "@/features/dishes/components/dishRowActions";
import userProfile from "@/assets/images/user-profile.png";
import { updateDish } from "../services/dishServices";

export const dishColumns = [
  {
    accessorKey: "thumbnail",
    header: "Imagen",
    cell: ({ row }) => {
      const dish = row.original;
      return (
        <img
          src={dish.dishImageUrl || userProfile}
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
    accessorKey: "isActive",
    header: "Estado",
    cell: ({ row }) => {
      const dish = row.original;

      const handleChange = async (value) => {
        await updateDish(dish.id, { isActive: value });
        dish.isActive = value;
      };

      return (
        <StatusSwitch
          checked={Boolean(dish.isActive ?? dish.status === "Habilitado")}
          onChange={handleChange}
          itemName={`el platillo "${dish.dishName}"`}
        />
      );
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => <DishRowActions dish={row.original} />,
  },
];