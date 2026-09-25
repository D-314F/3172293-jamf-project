import OrderRowActions from "../components/OrderRowActions";

export const OrderColumns = [
{
accessorKey: "id",
header: "ID",
},
{
accessorKey: "mesa",
header: "Mesa",
},
{
accessorKey: "mesero",
header: "Mesero",
},
{
accessorKey: "detalles",
header: "Platillos",
},
{
accessorKey: "fecha",
header: "Fecha",
cell: ({ row }) => new Date(row.original.fecha).toLocaleString(),
},
{
accessorKey: "estado",
header: "Estado",
cell: ({ row }) => (
    <span className="text-gray-800 font-medium">
    {row.original.estado}
    </span>
),
},
{
id: "actions",
header: "Acciones",
cell: ({ row }) => <OrderRowActions order={row.original} />,
},
];