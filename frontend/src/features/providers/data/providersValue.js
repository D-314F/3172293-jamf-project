export const documentTypes = [
  { value: "nit", label: "NIT Tributario" },
  { value: "cedula_ciudadania", label: "Cédula de ciudadanía" },
  { value: "cedula_extranjeria", label: "Cédula de extranjería" },
  { value: "permiso_permanencia", label: "Permiso Especial (PEP)" },
  { value: "permiso_proteccion_temporal", label: "Permiso por Protección Temporal (PPT)" },
  { value: "pasaporte", label: "Pasaporte" },
];

export const providerProducts = [
  { value: "carnes_embutidos", label: "Carnes y Embutidos Premium" },
  { value: "frutas_verduras", label: "Frutas, Verduras y Hortalizas (Fruver)" },
  { value: "lacteos_quesos", label: "Lácteos, Quesos y Derivados" },
  { value: "pescados_mariscos", label: "Pescados y Mariscos Frescos" },
  { value: "abarrotes_granos", label: "Abarrotes, Granos y Especias" },
  { value: "bebidas_licores", label: "Bebidas, Pulpas y Licores" },
  { value: "reposteria_panaderia", label: "Repostería, Panadería y Arepas" },
  { value: "empaques_insumos", label: "Empaques e Insumos Biodegradables" },
];

export function getProviderProductLabel(value) {
  if (!value) return "Insumos Generales";
  const found = providerProducts.find((item) => item.value === value);
  return found ? found.label : value;
}

export function getProviderDocLabel(value) {
  if (!value) return "NIT Tributario";
  const found = documentTypes.find((item) => item.value === value);
  return found ? found.label : value;
}