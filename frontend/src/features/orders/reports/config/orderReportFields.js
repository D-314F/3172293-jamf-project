export const orderReportFields = [
	{ key: "id", label: "ID Orden", default: true },
	{ key: "mesa", label: "Mesa", default: true },
	{ key: "mesero", label: "Mesero", default: true },
	{ key: "estado", label: "Estado", default: true },
	{ key: "fecha", label: "Fecha y Hora", default: true },
	{ key: "detalles", label: "Platillos", default: false },
];

export const orderReportFormats = [
	{ label: "PDF (.pdf)", value: "pdf" },
	{ label: "Excel (.xlsx)", value: "excel" },
];

export const orderReportScopes = [
	{ label: "Todas las órdenes", value: "all" },
	{ label: "Filtrar por Estado", value: "status" },
	{ label: "Filtrar por Mesero", value: "waiter" },
	{ label: "Filtrar por ID de Orden", value: "orderId" },
];

export const orderReportFilters = {
	status: {
		label: "Estado de la orden",
		placeholder: "Ej: Pendiente, Entregada, Cancelada",
	},
	waiter: {
		label: "Nombre del mesero",
		placeholder: "Ej: Pablo García Escobar",
	},
	orderId: {
		label: "ID de la orden",
		placeholder: "Ej: ORD-001",
	},
};