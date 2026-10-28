// src/features/inventory/reports/config/inventoryReportFields.js
export const inventoryReportFields = [
  { key: "id", label: "ID", default: true },
  { key: "name", label: "Nombre del producto", default: true },
  { key: "barcode", label: "Código de barras", default: true },
  { key: "quantity", label: "Cantidad existente", default: true },
  { key: "unitPrice", label: "Precio unitario", default: true },
  { key: "brand", label: "Marca", default: true },
  { key: "status", label: "Estado", default: true },
];

export const inventoryReportFormats = [
  { label: "PDF (.pdf)", value: "pdf" },
  { label: "Excel (.xlsx)", value: "excel" },
];

export const inventoryReportScopes = [
  { label: "Todo el inventario", value: "all" },
  { label: "Filtrar por marca / categoría", value: "category" },
];

export const inventoryReportFilters = {
  category: {
    label: "Marca o categoría",
    placeholder: "Ej: Jet, Bebidas...",
    emptyError: "Por favor ingresa una categoría o marca válida.",
  },
};