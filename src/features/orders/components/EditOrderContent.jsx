import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Select, Input, Button, Checkbox } from "@/shared";
import { MESEROS, ESTADOS_ORDEN } from "../data/ordersData";
import { orderSchema } from "../schemas/orderSchema";
import { showSuccessAlert, showCancelAlert } from "@/shared/services/alertService";

export default function EditOrderContent({
  initialFormData = {},
  onSubmit,
}) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = orderSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0];
        fieldErrors[fieldName] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    try {
      if (onSubmit) {
        await onSubmit(formData);
      }

      await showSuccessAlert({
        title: "Orden actualizada",
        text: "Los datos de la orden se han actualizado correctamente.",
        timer: 2000,
      });

      navigate(-1);
    } catch (error) {
      console.error("Error al actualizar la orden:", error);
      setErrors({ submit: "Error al actualizar la orden" });
    }
  };

  const handleCancel = async () => {
    const result = await showCancelAlert({
      title: "¿Deseas cancelar?",
      text: "Los cambios realizados no se guardarán.",
      timer: 3000,
    });

    if (result.isConfirmed) {
      navigate(-1);
    }
  };

  return (
    <div className="p-4 sm:p-8">
      {/* Botón Volver */}
      <Button
        variant="secondary"
        type="button"
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 bg-[var(--color-secondary-950)] text-[var(--color-text-inverse)] px-4 py-2 rounded-md mb-6 hover:bg-[var(--color-error-hover)] transition"
      >
        Atrás
      </Button>

      {/* Formulario */}
      <form onSubmit={handleSubmit}>
        <div className="bg-[var(--color-background-inverse)] text-[var(--color-black)] rounded-3xl p-6 sm:p-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start border border-[var(--color-brand)]">

          <div className="col-span-1 md:col-span-2 flex items-center gap-3 mb-2">
            <span className="font-[var(--font-heading)] text-[var(--color-text-inverse)]">
              Editar Orden
            </span>
          </div>

          {/* Campos de Entrada */}
          <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input
              label="Número de mesa"
              labelClassName="text-[var(--color-text-inverse)]"
              type="text"
              name="tableNumber"
              value={formData?.tableNumber || ""}
              onChange={handleChange}
              placeholder="Ej. 5"
              error={errors.tableNumber}
            />

            <Select
              label="Mesero responsable"
              labelClassName="text-[var(--color-text-inverse)]"
              name="waiterId"
              value={formData?.waiterId || ""}
              onChange={handleChange}
              options={MESEROS.map((mesero) => ({
                value: typeof mesero === "object" ? mesero.id || mesero.value : mesero,
                label: typeof mesero === "object" ? mesero.label || mesero.nombre : mesero,
              }))}
              error={errors.waiterId}
            />

            <Select
              label="Estado de la Orden"
              labelClassName="text-[var(--color-text-inverse)]"
              name="estado"
              value={formData?.estado || ""}
              onChange={handleChange}
              options={ESTADOS_ORDEN.map((estado) => ({
                value: typeof estado === "object" ? estado.id || estado.value : estado,
                label: typeof estado === "object" ? estado.label || estado.nombre : estado,
              }))}
              error={errors.estado}
            />

            <div className="flex items-center pt-2 sm:pt-6">
              <Checkbox
                id="isActive"
                name="isActive"
                label="Estado del registro"
                checked={Boolean(formData?.isActive)}
                onChange={handleChange}
              />
            </div>

            <div className="sm:col-span-2">
              <Input
                label="Observaciones"
                labelClassName="text-[var(--color-text-inverse)]"
                type="text"
                name="observations"
                value={formData?.observations || ""}
                onChange={handleChange}
                placeholder="Ej: Sin sal, salsa por separado..."
                error={errors.observations}
              />
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="col-span-1 md:col-span-2 flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              variant="secondary"
              type="button"
              onClick={handleCancel}
              className="bg-[var(--color-error)] text-[var(--color-text-inverse)] px-4 py-2 rounded-md hover:bg-[var(--color-error-hover)] transition w-full"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-[var(--color-success)] text-[var(--color-text-inverse)] px-4 py-2 rounded-md hover:bg-[var(--color-success-hover)] transition w-full"
            >
              Aplicar Cambios
            </Button>
          </div>

        </div>
      </form>
    </div>
  );
}