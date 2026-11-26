import DishStatusCell from "@/features/dishes/components/DishStatusCell";
import DishRowActions from "@/features/dishes/components/DishRowActions";
import {
  resolveDishImage,
  normalizeCategoryLabel,
  formatCopPrice,
} from "../utils/dishImages";

export const getDishColumns = ({ canView = true, canEdit = true } = {}) => [
  {
    accessorKey: "thumbnail",
    header: "Imagen",
    cell: ({ row }) => {
      const dish = row.original;
      return (
        <img
          src={resolveDishImage(dish)}
          alt={dish.dishName}
          className="w-11 h-11 object-cover rounded-xl border border-[var(--color-brand)]/30 shadow-sm"
        />
      );
    },
  },
  {
    accessorKey: "dishName",
    header: "Nombre del platillo",
    cell: ({ row }) => (
      <span className="font-semibold text-[var(--color-text-inverse)]">
        {row.original.dishName}
      </span>
    ),
  },
  {
    accessorKey: "category",
    header: "Categoría",
    cell: ({ row }) => (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-medium font-semibold bg-[var(--color-brand)]/12 text-[var(--color-brand)] border border-[var(--color-brand)]/25">
        {normalizeCategoryLabel(row.original.category)}
      </span>
    ),
  },
  {
    accessorKey: "price",
    header: "Precio",
    cell: ({ row }) => (
      <span className="font-bold text-[var(--color-brand)] whitespace-nowrap">
        {formatCopPrice(row.original.price)}
      </span>
    ),
  },
  {
    accessorKey: "stock",
    header: "Stock",
    cell: ({ row }) => {
      const stock = Number(
        row.original.effectiveStock ??
          row.original.stock ??
          row.original.dishStock ??
          0
      );
      const isOut = stock <= 0;
      return (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-medium font-semibold border whitespace-nowrap ${
            isOut
              ? "bg-[var(--color-error)]/15 text-[var(--color-error)] border-[var(--color-error)]/35"
              : "bg-[var(--color-success)]/15 text-[var(--color-success)] border-[var(--color-success)]/35"
          }`}
        >
          {isOut ? "Agotado (0)" : `${stock} uds.`}
        </span>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: "Estado",
    cell: ({ row }) => (
      <DishStatusCell
        key={`dish-status-${row.original.id}`}
        dish={row.original}
        canEdit={canEdit}
      />
    ),
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => (
      <DishRowActions
        dish={row.original}
        canView={canView}
        canEdit={canEdit}
      />
    ),
  },
];

export const dishColumns = getDishColumns();
