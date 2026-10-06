// src/features/inventory/data/inventory.js
export const inventory = [
  {
    id: 1,
    name: "Chocolate",
    barcode: "12L413P24L13",
    quantity: 43,
    unitPrice: 16,
    brand: "Jet",
    status: "Disponible",
  },
  {
    id: 2,
    name: "Verduras",
    barcode: "3148E72M124M",
    quantity: 19,
    unitPrice: 22,
    brand: "Cherry",
    status: "Disponible",
  },
  {
    id: 3,
    name: "Pasteles",
    barcode: "98OP65MK3M07",
    quantity: 20,
    unitPrice: 29,
    brand: "Wilton",
    status: "Agotado",
  },
  {
    id: 4,
    name: "Carnes",
    barcode: "P00I8754T385",
    quantity: 67,
    unitPrice: 35,
    brand: "Pul",
    status: "Vencido",
  },
  {
    id: 5,
    name: "Decoradores",
    barcode: "Q34R28M9FD43",
    quantity: 89,
    unitPrice: 35,
    brand: "Feyma",
    status: "Averiado",
  },
  {
    id: 6,
    name: "Atún",
    barcode: "XR618MP09DE5",
    quantity: 82,
    unitPrice: 58,
    brand: "Van Camps",
    status: "Agotado",
  },
  {
    id: 7,
    name: "Pulpo",
    barcode: "82COM67YIPI2",
    quantity: 0,
    unitPrice: 52,
    brand: "Zallo",
    status: "Vencido",
  },
];

export const MARCAS_OPTIONS = [
  { value: "alain Miliat", label: "Jugos" },
  { value: "neuhaus", label: "Chocolate" },
  { value: "tartuflanghe", label: "Trufas" },
  { value: "caviaroli", label: "Caviar" },
  { value: "jean Leon", label: "Vino" },
];

export const CUENTADANTES_OPTIONS = [
  { value: "julian ramiros", label: "Julian Ramiros" },
  { value: "karen cardona vicente", label: "Karen Cardona Vicente" },
  { value: "paola garcia", label: "Paola García" },
];
