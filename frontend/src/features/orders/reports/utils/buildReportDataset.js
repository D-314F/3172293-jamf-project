// Reemplaza todo: frontend/src/features/orders/reports/utils/buildReportDataset.js
export function buildReportDataset({
  orders = [],
  selectedFields = [],
  scope,
  filterValue,
}) {
  let filteredOrders = [...orders];
  const query = String(filterValue || "").trim().toLowerCase();

  if (scope === "status" && query) {
    filteredOrders = filteredOrders.filter((order) =>
      String(order.estado || "").toLowerCase().includes(query)
    );
  } else if ((scope === "waiter" || scope === "supplier") && query) {
    filteredOrders = filteredOrders.filter((order) =>
      String(order.mesero || "").toLowerCase().includes(query)
    );
  } else if (scope === "orderId" && query) {
    const cleanId = query.replace(/^ord-?0*/i, "").replace(/^#/, "");
    filteredOrders = filteredOrders.filter(
      (order) =>
        String(order.id).toLowerCase() === query ||
        String(order.id).toLowerCase() === cleanId
    );
  }

  const headers = selectedFields.map((field) => field.label);

  const rows = filteredOrders.map((order) =>
    selectedFields.map((field) => {
      if (field.key === "mesa") {
        return order.mesa ? `Mesa ${order.mesa}` : "-";
      }

      if (field.key === "fecha" && order.fecha) {
        return new Date(order.fecha).toLocaleString("es-CO");
      }

      if (field.key === "detalles" || field.key === "itemsCount") {
        if (Array.isArray(order.detalles)) {
          return order.detalles.map((d) => `${d.cantidad}x ${d.producto}`).join(", ");
        }
        return order.detalles || order.dishId || "-";
      }

      const value = order[field.key];
      return value ?? "-";
    })
  );

  return { headers, rows };
}