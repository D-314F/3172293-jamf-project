// Reemplaza todo: frontend/src/features/inventory/components/InventoryDetailsForm.jsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Save, PackageCheck } from "lucide-react";

import { Button, Input } from "@/shared";
import { inventoryDetailsSchema } from "../schemas/inventoryDetailsSchema";
import { createInventory } from "../services/inventoryServices";
import {
  showSuccessAlert,
  showCancelAlert,
  showUserErrorAlert,
} from "@/shared/services/alertService";

export default function InventoryDetailsForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const datosAnteriores = location.state?.formData || {};

  const [formData, setFormData] = useState({
    lote: datosAnteriores.lote || "",
    descripcion: datosAnteriores.descripcion || "",
    fechaVencimiento: datosAnteriores.fechaVencimiento || "",
    ubicacion: datosAnteriores.ubicacion || "",
    comentarioProducto: datosAnteriores.comentarioProducto || "",
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

    if (!datosAnteriores.nombre || !datosAnteriores.codigo) {
      await showUserErrorAlert({
        title: "Faltan datos del Paso 1",
        text: "Por favor inicia el registro desde el Paso 1 del inventario.",
      });
      navigate("/dashboard/createInventory");
      return;
    }

    const dataFinal = await validateForm();
    if (!dataFinal) return;

    try {
      setLoading(true);
      await createInventory(dataFinal);

      await showSuccessAlert({
        title: "¡Producto creado correctamente!",
        text: "El producto se ha registrado exitosamente en el inventario.",
        timer: 2000,
      });

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

  const handleCancelAll = async () => {
    const result = await showCancelAlert({
      title: "¿Deseas cancelar?",
      text: "Los cambios no están guardados.",
      timer: 3000,
    });

    if (result.isConfirmed) {
      navigate("/dashboard/inventoryList");
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-10 flex flex-col gap-4">
      <div className="flex justify-start">
        <Button
          variant="secondary"
          size="sm"
          type="button"
          onClick={handleVolverAtras}
          className="!w-auto flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Atrás (Paso 1)
        </Button>
      </div>

      <div className="bg-[var(--color-background-inverse)] text-[var(--color-text-inverse)] rounded-3xl border border-[var(--color-brand)]/60 shadow-2xl p-6 sm:p-10">
        {/* Encabezado consistente con Paso 1 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--color-border)] pb-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-[var(--font-heading)] text-[var(--color-text-inverse)]">
              Registrar Producto en Inventario (Paso 2 de 2)
            </h1>
            <p className="text-small text-[var(--color-text-muted)]">
              Completa el lote, fecha de vencimiento, ubicación en bodega y observaciones
            </p>
          </div>

          {datosAnteriores.nombre && (
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--color-surface-dark)] border border-[var(--color-brand)]/40 text-xs font-semibold text-[var(--color-brand)] self-start sm:self-auto">
              <PackageCheck className="w-4 h-4" />
              {datosAnteriores.codigo ? `${datosAnteriores.codigo} · ` : ""}
              {datosAnteriores.nombre}
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[var(--color-surface-dark)]/50 p-5 sm:p-6 rounded-2xl border border-[var(--color-border)]/60">
            <Input
              label="Número de Lote"
              name="lote"
              value={formData.lote}
              placeholder="Ej. LOTE-01 o 1"
              onChange={handleChange}
              error={errors.lote}
            />

            <Input
              label="Ubicación en el restaurante"
              name="ubicacion"
              value={formData.ubicacion}
              placeholder="Ej. Cuarto Frío 2, Alacena seca, Bodega principal"
              onChange={handleChange}
              error={errors.ubicacion}
            />

            <Input
              label="Fecha de vencimiento"
              name="fechaVencimiento"
              type="date"
              value={formData.fechaVencimiento}
              onChange={handleChange}
              error={errors.fechaVencimiento}
            />

            <Input
              label="Descripción / Uso en menú"
              name="descripcion"
              value={formData.descripcion}
              placeholder="Ej. Caja por 12 bolsas de 500g"
              onChange={handleChange}
              error={errors.descripcion}
            />

            <div className="md:col-span-2">
              <Input
                label="Comentario u observación adicional (Opcional)"
                name="comentarioProducto"
                value={formData.comentarioProducto}
                placeholder="Ej. Mantener refrigerado entre 2°C y 4°C"
                onChange={handleChange}
                error={errors.comentarioProducto}
              />
            </div>
          </div>

          <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 border-t border-[var(--color-border)]/40">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancelAll}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full sm:w-auto"
            >
              <Save className="w-4 h-4" />
              {loading ? "Guardando..." : "Guardar en Inventario"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}