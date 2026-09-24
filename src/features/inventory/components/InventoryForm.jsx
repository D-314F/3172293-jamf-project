import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Button from "../../../shared/components/Button";
import Input from "../../../shared/components/Input";
import Select from "../../../shared/components/Select";
import FileInput from "../../../shared/components/FileInput";
import { inventorySchema } from "../schemas/inventorySchema";
import { 
  showCancelAlert, 
  showUserErrorAlert 
} from "@/shared/services/alertService";

import { MARCAS_OPTIONS, CUENTADANTES_OPTIONS } from "../data/inventory";

export default function InventoryForm() {
  const navigate = useNavigate();
  const location = useLocation();

  // Si volvemos desde el paso 2, recuperamos la información ingresada previa
  const [formData, setFormData] = useState(
    location.state?.formData || {
      marca: "",
      cantidad: "",
      codigo: "",
      cantidadTotal: "",
      nombre: "",
      cantidadMinima: "",
      codigoBarras: "",
      valorUnitario: "",
      cuentadante: "",
      valorTotal: "",
      userImage: [],
    }
  );

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = inventorySchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = {};

      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
      });

      setErrors(fieldErrors);

      await showUserErrorAlert({
        title: "Error al registrar inventario",
        text: "Por favor, completa correctamente todos los campos requeridos.",
      });

      return;
    }

    setErrors({});

    // Redirige al paso 2 (Detalles) pasando los datos validados
    navigate("/dashboard/inventoryDetails", {
      state: {
        formData: result.data,
      },
    });
  };

  const handleCancel = async () => {
    const result = await showCancelAlert({
      title: "¿Deseas cancelar?",
      text: "Los cambios no guardados se perderán.",
      timer: 3000,
    });

    if (result.isConfirmed) {
      // Redirige explícitamente a la lista de inventario
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
          onClick={handleCancel}
        >
          Atrás
        </Button>

        <h1 className="text-xl sm:text-2xl font-bold text-white text-right">
          Crear Inventario
        </h1>

      </div>

      {/* Tarjeta contenedora */}
      <div className="bg-[var(--color-background-inverse)] rounded-2xl md:rounded-3xl border border-[var(--color-brand)] shadow-2xl p-5 sm:p-8 md:p-10">

        <form onSubmit={handleSubmit}>

          {/* Grid principal */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-start">

            {/* ==================== COLUMNA 1 ==================== */}
            <div className="flex flex-col gap-4">

              <Select
                label="Marca"
                name="marca"
                value={formData.marca}
                options={MARCAS_OPTIONS}
                onChange={handleChange}
                error={errors.marca}
              />

              <Input
                label="ID (Código único)"
                name="codigo"
                value={formData.codigo}
                onChange={handleChange}
                error={errors.codigo}
              />

              <Input
                label="Nombre completo"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                error={errors.nombre}
              />

              <Input
                label="Código de barras"
                name="codigoBarras"
                value={formData.codigoBarras}
                onChange={handleChange}
                error={errors.codigoBarras}
              />

              <Select
                label="Cuentadante"
                name="cuentadante"
                value={formData.cuentadante}
                options={CUENTADANTES_OPTIONS}
                onChange={handleChange}
                error={errors.cuentadante}
              />

            </div>


            {/* ==================== COLUMNA 2 ==================== */}
            <div className="flex flex-col gap-4">

              <Input
                label="Cantidad"
                name="cantidad"
                value={formData.cantidad}
                onChange={handleChange}
                error={errors.cantidad}
              />

              <Input
                label="Cantidad total"
                name="cantidadTotal"
                value={formData.cantidadTotal}
                onChange={handleChange}
                error={errors.cantidadTotal}
              />

              <Input
                label="Cantidad mínima"
                name="cantidadMinima"
                value={formData.cantidadMinima}
                onChange={handleChange}
                error={errors.cantidadMinima}
              />

              <Input
                label="Valor unitario"
                name="valorUnitario"
                value={formData.valorUnitario}
                onChange={handleChange}
                error={errors.valorUnitario}
              />

              <Input
                label="Valor total"
                name="valorTotal"
                value={formData.valorTotal}
                onChange={handleChange}
                error={errors.valorTotal}
              />

            </div>


            {/* ==================== COLUMNA 3 ==================== */}
            <div className="flex flex-col gap-4">

              {/* Imagen */}
              <div className="flex flex-col items-start gap-2 w-full">
                <span className="text-[var(--color-text-inverse)] text-sm font-medium">
                  Imagen del producto
                </span>

                <FileInput
                  className="border-[var(--color-border)] w-full"
                  value={formData.userImage}
                  onChange={(files) => {
                    setFormData((prev) => ({
                      ...prev,
                      userImage: files,
                    }));
                    if (errors.userImage) {
                      setErrors((prev) => ({ ...prev, userImage: "" }));
                    }
                  }}
                  multiple={true}
                />

                {errors.userImage && (
                  <span className="text-red-400 text-xs">
                    {errors.userImage}
                  </span>
                )}
              </div>

              {/* Botones */}
              <div className="flex flex-col gap-2 pt-6">

                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  className="w-full"
                  onClick={handleCancel}
                >
                  Cancelar
                </Button>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full"
                >
                  Siguiente
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}