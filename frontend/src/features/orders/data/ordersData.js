export const MESEROS = [
  { id: 1, value: "Carlos Mendoza", label: "Carlos Mendoza" },
  { id: 2, value: "Laura Gómez", label: "Laura Gómez" },
  { id: 3, value: "Andrés Torres", label: "Andrés Torres" },
  { id: 4, value: "Sofía Vargas", label: "Sofía Vargas" },
  { id: 5, value: "Juan Pablo Ríos", label: "Juan Pablo Ríos" },
];

export const PLATILLOS = [
  { id: 1, value: "Torta atún rojo", label: "Torta atún rojo", price: 38000 },
  { id: 2, value: "Carpaccio de res trufado", label: "Carpaccio de res trufado", price: 34000 },
  { id: 3, value: "Magret de pato", label: "Magret de pato", price: 52000 },
  { id: 4, value: "Bistec turco", label: "Bistec turco", price: 64000 },
  { id: 5, value: "Salmón noruego", label: "Salmón noruego", price: 58000 },
  { id: 6, value: "Roulade de ave", label: "Roulade de ave", price: 46000 },
  { id: 7, value: "Pechuga a la naranja", label: "Pechuga a la naranja", price: 42000 },
  { id: 8, value: "Bandeja especial JAMF", label: "Bandeja especial JAMF", price: 48000 },
  { id: 9, value: "Ensalada César de la casa", label: "Ensalada César de la casa", price: 29000 },
  { id: 10, value: "Ensalada mediterránea tibia", label: "Ensalada mediterránea tibia", price: 31000 },
  { id: 11, value: "Souffle grand marmier", label: "Souffle grand marmier", price: 28000 },
  { id: 12, value: "Pavlova de frutos rojos", label: "Pavlova de frutos rojos", price: 26000 },
  { id: 13, value: "Limonada de frutos rojos y menta", label: "Limonada de frutos rojos y menta", price: 16000 },
];

export const ESTADOS_ORDEN = [
  { value: "Pendiente", label: "Pendiente" },
  { value: "Entregada", label: "Entregada" },
  { value: "Pagada", label: "Pagada" },
  { value: "Cancelada", label: "Cancelada" },
];

export const INITIAL_ORDERS = [
  {
    id: 1,
    tableNumber: 3,
    waiter: "Carlos Mendoza",
    dishes: "2x Bistec turco",
    orderDate: "2026-03-01 12:30",
    status: "Entregada",
    observations: "Término medio, sin sal adicional.",
  },
  {
    id: 2,
    tableNumber: 7,
    waiter: "Laura Gómez",
    dishes: "1x Salmón noruego",
    orderDate: "2026-03-01 13:15",
    status: "Pendiente",
    observations: "Cliente alérgico a frutos secos.",
  },
];