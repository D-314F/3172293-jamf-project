export const MESEROS = [
  { id: 1, value: "James Machado Hernández", label: "James Machado Hernández (Mesero)" },
  { id: 2, value: "Maycol Silva Orozco", label: "Maycol Silva Orozco (Cajero)" },
  { id: 3, value: "Fabián Guzmán Villegas", label: "Fabián Guzmán Villegas (Administrador)" },
  { id: 4, value: "Carlos Andrés Gómez", label: "Carlos Andrés Gómez (Cocina)" },
];

export const PLATILLOS = [
  { id: 1, value: "Torta atún rojo", label: "Torta atún rojo", category: "Entradas", price: 38000 },
  { id: 2, value: "Carpaccio de res trufado", label: "Carpaccio de res trufado", category: "Entradas", price: 34000 },
  { id: 3, value: "Magret de pato", label: "Magret de pato", category: "Platos Fuertes", price: 52000 },
  { id: 4, value: "Bistec turco", label: "Bistec turco", category: "Platos Fuertes", price: 64000 },
  { id: 5, value: "Salmón noruego", label: "Salmón noruego", category: "Platos Fuertes", price: 58000 },
  { id: 6, value: "Roulade de ave", label: "Roulade de ave", category: "Platos Fuertes", price: 46000 },
  { id: 7, value: "Pechuga a la naranja", label: "Pechuga a la naranja", category: "Platos Fuertes", price: 42000 },
  { id: 8, value: "Bandeja especial JAMF", label: "Bandeja especial JAMF", category: "Platos Fuertes", price: 48000 },
  { id: 9, value: "Ensalada César de la casa", label: "Ensalada César de la casa", category: "Ensaladas", price: 29000 },
  { id: 10, value: "Ensalada mediterránea tibia", label: "Ensalada mediterránea tibia", category: "Ensaladas", price: 31000 },
  { id: 11, value: "Souffle grand marmier", label: "Souffle grand marmier", category: "Postres", price: 28000 },
  { id: 12, value: "Pavlova de frutos rojos", label: "Pavlova de frutos rojos", category: "Postres", price: 26000 },
  { id: 13, value: "Limonada de frutos rojos y menta", label: "Limonada de frutos rojos y menta", category: "Bebidas", price: 16000 },
];

export const ESTADOS_ORDEN = [
  { value: "Pendiente", label: "Pendiente" },
  { value: "En preparación", label: "En preparación" },
  { value: "Entregada", label: "Entregada" },
  { value: "Pagada", label: "Pagada" },
  { value: "Cancelada", label: "Cancelada" },
];

export const METODOS_PAGO = [
  { value: "Efectivo", label: "Efectivo" },
  { value: "Datáfono", label: "Datáfono / Tarjeta" },
  { value: "Transferencia / Nequi", label: "Nequi / Transf." },
  { value: "Por cobrar", label: "Por cobrar" },
];

export const TIPOS_SERVICIO = [
  { value: "En Sala", label: "En Sala" },
  { value: "Para Llevar", label: "Para Llevar" },
  { value: "Domicilio", label: "Domicilio" },
];

export const INITIAL_ORDERS = [
  {
    id: 1,
    tableNumber: 4,
    waiter: "James Machado Hernández",
    dishes: "2x Bandeja especial JAMF, 2x Limonada de frutos rojos y menta",
    orderDate: "2026-11-14 12:30",
    status: "En preparación",
    observations: "[En Sala | Pago: Datáfono] Término tres cuartos.",
  },
  {
    id: 2,
    tableNumber: 7,
    waiter: "Maycol Silva Orozco",
    dishes: "2x Salmón noruego, 1x Carpaccio de res trufado",
    orderDate: "2026-11-14 13:15",
    status: "Entregada",
    observations: "[En Sala | Pago: Efectivo] Salsas por separado.",
  },
];