import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Input, Select, Checkbox, Button } from "@/shared";
import { orderSchema } from "../schemas/orderSchema";
import { MESEROS, PLATILLOS } from "../data/ordersData";
import { 
  showSuccessAlert, 
  showUserErrorAlert,
  showCancelAlert 
} from "@/shared/services/alertService";
import { createOrder } from "../services/orderServices";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = orderSchema.safeParse(formData);

    if (!result.success) {
      const newErrors = {};
      result.error.issues.forEach((issue) => {
        newErrors[issue.path[0]] = issue.message;
      });
      setErrors(newErrors);

      await showUserErrorAlert({
        title: "Error al crear la orden",
        text: "Por favor, revisa y completa los campos obligatorios.",
      });

      return;
    }

    setErrors({});

      try {
        const response = await createOrder(result.data);
        console.log("Orden creada:", response);

        await showSuccessAlert({
          title: "¡Orden Creada!",
          text: "La orden se ha generado exitosamente.",
          timer: 2000,
      });

      setFormData({
        tableNumber: "",
        isActive: true,
        waiterId: "",
        dishId: "",
        quantity: "1",
        observations: "",
      });

      navigate("/dashboard/orderList");
    } catch (error) {
      console.error(error);
      await showUserErrorAlert({
        title: "Error inesperado",
        text: "Ocurrió un error al intentar crear la orden.",
      });
    }
  };

  const handleCancel = async () => {
    const result = await showCancelAlert({
      title: "¿Deseas cancelar?",
      text: "Los datos ingresados en esta orden no se guardarán.",
    });

    if (result.isConfirmed) {
      navigate("/dashboard/orderList");
    }
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-20 md:pt-28 pb-10 flex flex-col gap-6">
     
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="secondary"
          size="sm"
          type="button"
          onClick={handleCancel}
          className="!w-auto flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Atrás
        </Button>

        <h1 className="text-xl sm:text-2xl font-bold font-[var(--font-heading)] text-[var(--color-text-inverse)] text-right">
          Agregar Orden
        </h1>
      </div>

      {/*Formulario */}
      <div className="bg-[var(--color-background-inverse)] text-[var(--color-text-inverse)] rounded-3xl p-6 sm:p-10 w-full border border-[var(--color-brand)] shadow-2xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <Input
              label="Número de mesa"
              name="tableNumber"
              type="number"
              value={formData.tableNumber}
              onChange={handleChange}
              error={errors.tableNumber}
              placeholder="Ej. 5"
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

            <div className="flex items-center pt-2 md:pt-6">
              <Checkbox
                label="Estado del registro"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />
            </div>

            <div className="md:col-span-2">
              <Input
                label="Observaciones"
                name="observations"
                value={formData.observations}
                onChange={handleChange}
                error={errors.observations}
                placeholder="Ej: Sin cebolla, término medio..."
              />
            </div>
          </div>

          
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-[var(--color-brand)]/30">
            <Button 
              variant="secondary" 
              type="button" 
              onClick={handleCancel}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button 
              variant="primary" 
              type="submit"
              className="w-full sm:w-auto"
            >
              Crear Orden
            </Button>
          </div>

        </form>
      </div>
    </section>
  );
}