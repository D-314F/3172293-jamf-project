import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Select, Checkbox, Button } from "@/shared";
import { orderSchema } from "../schemas/orderSchema";

const MESEROS = [
  { value: "1", label: "Pablo García Escobar" },
  { value: "2", label: "Sofía Vargas" },
  { value: "3", label: "Juan Pablo Ríos" },
  { value: "4", label: "Camila Herrera" },
  { value: "5", label: "Santiago Morales" },
  { value: "6", label: "Valentina Castro" },
  { value: "7", label: "Andrés Pinzón" },
];

const PLATILLOS = [
  { value: "1", label: "Souffle grand marmier" },
  { value: "2", label: "Cazuela Parisina" },
  { value: "3", label: "Entradas Refinadas" },
  { value: "4", label: "Bistec turco" },
  { value: "5", label: "Principales magníficos" },
  { value: "6", label: "Torta atún rojo" },
  { value: "7", label: "Carpacio de pulpo" },
];

export default function OrderForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    tableNumber: "",
    isActive: true,
    waiterId: "",
    dishId: "",
    quantity: "1",
    observations: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = orderSchema.safeParse(formData);

    if (!result.success) {
      const newErrors = {};
      result.error.issues.forEach(issue => {
        newErrors[issue.path[0]] = issue.message;
      });
      setErrors(newErrors);
      return;
    }

    setErrors({});
    console.log("Orden creada:", result.data);
    alert("Orden creada correctamente");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="self-start mt-4"> 
        <Button
          variant="secondary"
          size="sm"
          type="button"
          onClick={() => navigate(-1)}
        >
          Atrás
        </Button>
      </div>

      <div className="w-full max-w-2xl p-8 bg-[var(--color-background-inverse)] border border-[var(--color-brand)] rounded-3xl">
        <h2 className="text-[var(--text-title)] font-[var(--font-heading)] text-[var(--color-text-inverse)] mb-6">
          Agregar orden
        </h2>

        <form onSubmit={handleSubmit} className="gap-6 flex flex-col">
          <Input
            label="Número de mesa"
            name="tableNumber"
            type="number"
            value={formData.tableNumber}
            onChange={handleChange}
            error={errors.tableNumber}
          />

          <Checkbox
            label="Estado"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            text={formData.isActive ? "Activo" : "Inactivo"}
          />

          <Select
            label="Mesero Responsable"
            name="waiterId"
            value={formData.waiterId}
            onChange={handleChange}
            options={MESEROS}
            error={errors.waiterId}
          />

          <Select
            label="Lista Platillos" 
            name="dishId"
            value={formData.dishId}
            onChange={handleChange}
            options={PLATILLOS}
            error={errors.dishId}
          />

          <Input
            label="Cantidades del Platillo"
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={handleChange}
            error={errors.quantity}
          />

          <Input
            label="Observaciones"
            name="observations"
            value={formData.observations}
            onChange={handleChange}
            error={errors.observations}
            placeholder="Ej: Sin cebolla, término medio..."
          />

          <Button variant="primary" type="submit">
            Crear Orden
          </Button>
        </form>
      </div>
    </div>
  );
}
