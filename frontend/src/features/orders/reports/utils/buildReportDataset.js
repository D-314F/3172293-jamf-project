export function buildReportDataset({
orders,
selectedFields,
scope,
filterValue,
}) {
let filteredOrders = [...orders];

// Filtros opcionales por alcance
if (scope === "status" && filterValue) {
    filteredOrders = filteredOrders.filter(
    (order) => order.estado?.toLowerCase().includes(filterValue.toLowerCase())
    );
} else if (scope === "supplier" && filterValue) {
    filteredOrders = filteredOrders.filter((order) =>
    order.mesero?.toLowerCase().includes(filterValue.toLowerCase())
    );
} else if (scope === "orderId" && filterValue) {
    filteredOrders = filteredOrders.filter(
    (order) => String(order.id).toLowerCase() === String(filterValue).trim().toLowerCase()
    );
}

// Encabezados
const headers = selectedFields.map((field) => field.label);

// Filas
const rows = filteredOrders.map((order) =>
    selectedFields.map((field) => {
    // Manejo especial de campos estructurados o formateados
    if (field.key === "mesa") {
        return order.mesa ? `Mesa ${order.mesa}` : "-";
    }

    if (field.key === "fecha" && order.fecha) {
        return new Date(order.fecha).toLocaleString();
    }

    if (field.key === "detalles" || field.key === "itemsCount") {
        if (Array.isArray(order.detalles)) {
        return order.detalles.map((d) => `${d.cantidad}x ${d.producto}`).join(", ");
        }
        return "-";
    }

    const value = order[field.key];
    return value ?? "-";
    })
);

return { headers, rows };
}