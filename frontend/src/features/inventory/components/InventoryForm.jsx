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

import { ArrowLeft } from "lucide-react";

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
        title: "Error al registrar producto",
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
      text: "Los cambios no se han guardado.",
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
          onClick={handleCancel}
          className="w-auto flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Atrás
        </Button>

        <h1 className="text-xl sm:text-2xl font-bold text-white text-right">
          Registrar Producto en Inventario
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
                label="Marca del producto"
                name="marca"
                value={formData.marca}
                options={MARCAS_OPTIONS}
                onChange={handleChange}
                error={errors.marca}
              />

              <Input
                label="ID (Código único interno)"
                name="codigo"
                value={formData.codigo}
                placeholder="Ej. INV001 o 105"
                className="h-10"
                onChange={handleChange}
                error={errors.codigo}
              />

              <Input
                label="Nombre del producto"
                name="nombre"
                value={formData.nombre}
                placeholder="Ej. Chocolate amargo, Harina de trigo"
                className="h-10"
                onChange={handleChange}
                error={errors.nombre}
              />

              <Input
                label="Código de barras"
                name="codigoBarras"
                value={formData.codigoBarras}
                placeholder="Ej. 7702001054321 (solo números)"
                className="h-10"
                onChange={handleChange}
                error={errors.codigoBarras}
              />

              <Select
                label="Cuentadante (Responsable en bodega)"
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
                label="Cantidad que ingresa (Lote actual)"
                name="cantidad"
                value={formData.cantidad}
                placeholder="Ej. 20"
                className="h-10"
                onChange={handleChange}
                error={errors.cantidad}
              />

              <Input
                label="Cantidad total en bodega"
                name="cantidadTotal"
                value={formData.cantidadTotal}
                placeholder="Ej. 50"
                className="h-10"
                onChange={handleChange}
                error={errors.cantidadTotal}
              />

              <Input
                label="Cantidad mínima (Alerta de agotado)"
                name="cantidadMinima"
                value={formData.cantidadMinima}
                placeholder="Ej. 5"
                className="h-10"
                onChange={handleChange}
                error={errors.cantidadMinima}
              />

              <Input
                label="Valor unitario ($)"
                name="valorUnitario"
                value={formData.valorUnitario}
                placeholder="Ej. 15000"
                className="h-10"
                onChange={handleChange}
                error={errors.valorUnitario}
              />

              <Input
                label="Valor total del lote ($)"
                name="valorTotal"
                value={formData.valorTotal}
                placeholder="Ej. 300000 (Cantidad x Valor unitario)"
                className="h-10"
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
                  Siguiente (Paso 2)
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}