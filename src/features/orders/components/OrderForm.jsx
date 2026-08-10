import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Select, Checkbox, Button } from "@/shared";
import { orderSchema } from "../schemas/orderSchema";
import { MESEROS, PLATILLOS } from "../data/ordersData";

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
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = orderSchema.safeParse(formData);

    if (!result.success) {
      const newErrors = {};
      result.error.issues.forEach((issue) => {
        newErrors[issue.path[0]] = issue.message;
      });
      setErrors(newErrors);
      return;
    }

    setErrors({});
    console.log("Orden creada:", result.data);
    alert("¡Orden creada correctamente!");

    // Opción 2: Limpia los campos para registrar otra orden de inmediato
    setFormData({
      tableNumber: "",
      isActive: true,
      waiterId: "",
      dishId: "",
      quantity: "1",
      observations: "",
    });
  };

  return (
    <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-20 md:pt-28 pb-10">
      
      {/* Header con botón Atrás redirigiendo al Dashboard / Home */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <Button
          variant="secondary"
          size="sm"
          type="button"
          onClick={() => navigate("/dashboard/home")}
        >
          Atrás
        </Button>
        <h1 className="text-xl sm:text-2xl font-bold text-white text-right">
          Agregar Orden
        </h1>
      </div>

      {/* Contenedor del Formulario */}
      <div className="bg-[var(--color-background-inverse)] rounded-2xl md:rounded-3xl border border-[var(--color-brand)] shadow-2xl p-5 sm:p-8 md:p-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <Input
              label="Número de mesa"
              name="tableNumber"
              type="number"
              value={formData.tableNumber}
              onChange={handleChange}
              error={errors.tableNumber}
            />

            <div className="flex items-center md:pt-6">
              <Checkbox
                label="Estado"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                text={formData.isActive ? "Activo" : "Inactivo"}
              />
            </div>

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
          </div>

          <div className="w-full flex justify-end gap-3 pt-6 border-t border-[var(--color-border)]/20">
            <Button variant="primary" type="submit">
              Crear Orden
            </Button>
          </div>

        </form>
      </div>
    </section>
  );
}