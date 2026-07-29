// src/features/dishes/dishColumns.js

import StatusSwitch from "@/shared/components/StatusSwitch";
import DishRowActions from "@/features/dishes/components/dishRowActions";

export const dishColumns = [
  {
    accessorKey: "id",
    header: "Id",
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
        // updateDishStatus(dish.id, value)
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
