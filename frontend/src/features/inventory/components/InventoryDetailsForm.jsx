import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Button from "../../../shared/components/Button";
import Input from "../../../shared/components/Input";
import { inventoryDetailsSchema } from "../schemas/inventoryDetailsSchema";
import { createInventory } from "../services/inventoryServices";

// Servicios de alertas
import {
  showSuccessAlert,
  showCancelAlert,
  showUserErrorAlert,
} from "../../../shared/services/alertService";

export default function InventoryDetailsForm() {
  const navigate = useNavigate();
  const location = useLocation();

  // Datos recibidos del formulario anterior (Paso 1)
  const datosAnteriores = location.state?.formData || {};

  const [formData, setFormData] = useState({
    lote: "",
    descripcion: "",
    fechaVencimiento: "",
    ubicacion: "",
    comentarioProducto: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = async () => {
    const result = inventoryDetailsSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = {};

      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
      });

      setErrors(fieldErrors);

      // Alerta de error si faltan campos obligatorios
      await showUserErrorAlert({
        title: "Error de validación",
        text: "Por favor, completa correctamente todos los campos obligatorios.",
      });

      return null;
    }

    setErrors({});

    return {
      ...datosAnteriores,
      ...result.data,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataFinal = await validateForm();

    if (!dataFinal) return;

    try {
      setLoading(true);

      // Conecta con el API para guardar en PostgreSQL
      const response = await createInventory(dataFinal);
      console.log("Inventario guardado en BD:", response);

      await showSuccessAlert({
        title: "¡Producto creado correctamente!",
        text: "El producto se ha registrado exitosamente en el inventario.",
        timer: 2000,
      });

      // Redirección explícita a la lista al finalizar
      navigate("/dashboard/inventoryList");
    } catch (error) {
      console.error("Error al registrar el producto:", error);

      await showUserErrorAlert({
        title: "Error inesperado",
        text: "Ocurrió un error al registrar el producto. Inténtalo de nuevo.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Regresar al Paso 1 conservando la información
  const handleVolverAtras = () => {
    navigate("/dashboard/createInventory", {
      state: {
        formData: {
          ...datosAnteriores,
          ...formData,
        },
      },
    });
  };

  // Cancelar todo el proceso y volver a la lista principal
  const handleCancelAll = async () => {
    const result = await showCancelAlert({
      title: "¿Deseas cancelar?",
      text: "Los cambios no estan guardados.",
      timer: 3000,
    });

    if (result.isConfirmed) {
      navigate("/dashboard/inventoryList");
    }
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-20 md:pt-28 pb-10">
      {/* Header superior */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <Button
          variant="secondary"
          size="sm"
          type="button"
          onClick={handleVolverAtras}
        >
          Atrás (Paso 1)
        </Button>

        <h1 className="text-xl sm:text-2xl font-bold text-white text-right">
          Registrar Producto - Detalles de Lote y Bodega
        </h1>
      </div>

      {/* Tarjeta del formulario */}
      <div className="bg-[var(--color-background-inverse)] rounded-2xl md:rounded-3xl border border-[var(--color-brand)] shadow-2xl p-5 sm:p-8 md:p-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Campos del formulario */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <Input
              label="Número de Lote"
              name="lote"
              value={formData.lote}
              placeholder="Ej. LOTE-01 o 1"
              className="h-10"
              onChange={handleChange}
              error={errors.lote}
            />

            <Input
              label="Ubicación en el restaurante"
              name="ubicacion"
              value={formData.ubicacion}
              placeholder="Ej. Nevera 2, Alacena seca, Bodega principal"
              className="h-10"
              onChange={handleChange}
              error={errors.ubicacion}
            />

            <Input
              label="Fecha de vencimiento"
              name="fechaVencimiento"
              type="date"
              value={formData.fechaVencimiento}
              className="h-10"
              onChange={handleChange}
              error={errors.fechaVencimiento}
            />

            <Input
              label="Descripción del empaque / producto"
              name="descripcion"
              value={formData.descripcion}
              placeholder="Ej. Caja por 12 bolsas de 500g"
              className="h-10"
              onChange={handleChange}
              error={errors.descripcion}
            />

            <div className="md:col-span-2">
              <Input
                label="Comentario u observación adicional (Opcional)"
                name="comentarioProducto"
                value={formData.comentarioProducto}
                placeholder="Ej. Mantener refrigerado entre 2°C y 4°C"
                className="h-10"
                onChange={handleChange}
                error={errors.comentarioProducto}
              />
            </div>
          </div>

          {/* Botones de acción inferiores */}
          <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-3 pt-6 border-t border-[var(--color-border)]/20">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancelAll}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>

            <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="w-full sm:w-auto"
              >
                {loading ? "Guardando..." : "Guardar en Inventario"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}