import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Button from "../../../shared/components/Button";
import Input from "../../../shared/components/Input";
import { inventoryUltimosSchema } from "../schemas/inventoryUltimosSchema";

// Servicio de alertas
import {
  showSuccessAlert,
  showCancelAlert,
} from "../../../shared/services/alertService";

export default function InventoryUltimosPasos() {
  const navigate = useNavigate();
  const location = useLocation();

  // Datos recibidos del formulario anterior
  const datosAnteriores = location.state?.formData || {};

  // Estado del formulario
  const [formData, setFormData] = useState({
    lote: "",
    descripcion: "",
    fechaVencimiento: "",
    ubicacion: "",
    comentarioProducto: "",
  });

  // Estado de errores
  const [errors, setErrors] = useState({});

  // Estado de carga
  const [loading, setLoading] = useState(false);

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Validar formulario
  const validateForm = () => {
    const result = inventoryUltimosSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = {};

      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
      });

      setErrors(fieldErrors);

      return null;
    }

    setErrors({});

    // Unir los datos anteriores con los datos actuales
    return {
      ...datosAnteriores,
      ...result.data,
    };
  };

  // Crear inventario
  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataFinal = validateForm();

    // Si la validación falla, no continúa
    if (!dataFinal) return;

    try {
      setLoading(true);

      // Aquí posteriormente puedes conectar el servicio para guardar
      // await createInventory(dataFinal);

      console.log("Inventario listo para guardar:", dataFinal);

      // Alerta de creación exitosa
      await showSuccessAlert({
        title: "¡Producto creado correctamente!",
        text: "El producto se ha registrado correctamente.",
        timer: 2000,
      });

      // Redirigir al listado de inventario
      navigate("/dashboard/inventoryList");
    } catch (error) {
      console.error("Error al registrar el producto:", error);

      // Alerta de error
      alert("Error al registrar el producto");
    } finally {
      setLoading(false);
    }
  };

  // Regresar al formulario anterior
  const handleVolverAtras = async () => {
    const result = await showCancelAlert({
      title: "¿Deseas volver atrás?",
      text: "Los datos ingresados en este formulario se conservarán.",
      timer: 2500,
    });

    if (result.isConfirmed) {
      navigate("/dashboard/createInventory", {
        state: {
          formData: {
            ...datosAnteriores,
            ...formData,
          },
        },
      });
    }
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-20 md:pt-28 pb-10">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        
        <Button
          variant="secondary"
          size="sm"
          type="button"
          onClick={handleVolverAtras}
          disabled={loading}
        >
          Atrás
        </Button>

        <h1 className="text-xl sm:text-2xl font-bold text-white text-right">
          Crear Inventario - Últimos Pasos
        </h1>
      </div>

      {/* Tarjeta del formulario */}
      <div className="bg-[var(--color-background-inverse)] rounded-2xl md:rounded-3xl border border-[var(--color-brand)] shadow-2xl p-5 sm:p-8 md:p-10">
        
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6"
        >
          
          {/* Campos del formulario */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            
            {/* Lote */}
            <Input
              label="Lote"
              name="lote"
              value={formData.lote}
              onChange={handleChange}
              error={errors.lote}
            />

            {/* Ubicación */}
            <Input
              label="Ubicación"
              name="ubicacion"
              value={formData.ubicacion}
              onChange={handleChange}
              error={errors.ubicacion}
            />

            {/* Fecha de vencimiento */}
            <Input
              label="Fecha de vencimiento"
              name="fechaVencimiento"
              placeholder="Ej: DD/MM/AAAA"
              value={formData.fechaVencimiento}
              onChange={handleChange}
              error={errors.fechaVencimiento}
            />

            {/* Descripción */}
            <Input
              label="Descripción"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              error={errors.descripcion}
            />

            {/* Comentario */}
            <div className="md:col-span-2">
              <Input
                label="Comentario del producto"
                name="comentarioProducto"
                value={formData.comentarioProducto}
                onChange={handleChange}
                error={errors.comentarioProducto}
              />
            </div>
          </div>

          {/* Botón de crear */}
          <div className="w-full flex justify-end gap-3 pt-6 border-t border-[var(--color-border)]/20">
            
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading ? "Creando..." : "Crear Inventario"}
            </Button>

          </div>
        </form>
      </div>
    </section>
  );
}