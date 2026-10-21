import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Select, Input, Button, Checkbox, FileInput } from "@/shared";
import documentTypes from "../../../data/selects/documentsTypes.json";
import productCategories from "../../../data/selects/productCategories.json";
import { providerSchema } from "../schemas/providerSchema";
import { showSuccessAlert, showCancelAlert } from "@/shared/services/alertService";

export default function ProviderEditContent({
  formData = {},
  setFormData,
}) {
  const navigate = useNavigate();
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

    const result = providerSchema.safeParse(formData);

    if (!result.success) {
      console.log("Errores de Zod:", result.error.issues);
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    try {
      await showSuccessAlert({
        title: "Proveedor editado",
        text: "El Proveedor se ha editado correctamente",
        timer: 2000,
      });

      navigate(-1);
    } catch (error) {
      console.error("Error al editar el Proveedor", error);
      setErrors({ submit: "Error al editar el Proveedor" });
    }
  };

  const handleCancel = async () => {
    const result = await showCancelAlert({
      title: "Cancelado",
      text: "Los cambios no guardados se perderán.",
      timer: 3000,
    });

    if (result.isConfirmed) {
      navigate(-1);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-20 md:pt-28 pb-10 flex flex-col gap-4">
      
      <div className="flex justify-start">
        <Button
          variant="secondary"
          size="sm"
          type="button"
          onClick={() => navigate(-1)}
          className="!w-auto flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Atrás
        </Button>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit}>
        <div className="bg-[var(--color-background-inverse)] text-[var(--color-text-inverse)] rounded-3xl p-6 sm:p-10 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-center border border-[var(--color-brand)]">
          <div className="col-span-1 md:col-span-2 lg:col-span-3 flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold font-[var(--font-heading)] text-[var(--color-text-inverse)]">
              Editar Proveedor
            </h1>
          </div>

          {/* Campos de Entrada */}
          <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Tipo de documento"
              name="providerDocumentType"
              value={formData?.providerDocumentType || ""}
              options={documentTypes.map((doc) => ({
                value: doc.id,
                label: doc.label,
              }))}
              onChange={handleChange}
              error={errors.providerDocumentType}
            />

            <Input
              label="Número de documento"
              type="text"
              name="providerDocumentNumber"
              value={formData?.providerDocumentNumber || ""}
              onChange={handleChange}
              placeholder="Número Documento"
              error={errors.providerDocumentNumber}
            />

            <Input
              label="Nombre completo"
              type="text"
              name="providerName"
              value={formData?.providerName || ""}
              onChange={handleChange}
              placeholder="Nombre completo"
              error={errors.providerName}
            />

            <Input
              label="Correo electrónico empresa"
              type="text"
              name="providerEmail"
              value={formData?.providerEmail || ""}
              onChange={handleChange}
              placeholder="Correo electrónico"
              error={errors.providerEmail}
            />

            <Input
              label="Número telefónico"
              type="text"
              name="providerPhone"
              value={formData?.providerPhone || ""}
              onChange={handleChange}
              placeholder="Número telefónico"
              error={errors.providerPhone}
            />

            <Select
              label="Productos que suministra"
              name="providerProducts"
              value={formData?.providerProducts || ""}
              options={productCategories.map((prod) => ({
                value: prod.id,
                label: prod.label,
              }))}
              onChange={handleChange}
              error={errors.providerProducts}
            />

            <Input
              label="Dirección residencial"
              type="text"
              name="providerAddress"
              value={formData?.providerAddress || ""}
              onChange={handleChange}
              placeholder="Dirección residencial"
              error={errors.providerAddress}
            />

            <Input
              label="Observaciones"
              type="text"
              name="providerObservations"
              value={formData?.providerObservations || ""}
              onChange={handleChange}
              placeholder="Observaciones"
              error={errors.providerObservations}
            />
          </div>

         
          <div className="flex flex-col items-center justify-center gap-4 w-full">
            <FileInput
              value={formData.providerImage}
              onChange={(files) =>
                setFormData((prev) => ({ ...prev, providerImage: files }))
              }
              multiple={false}
            />
            {errors.providerImage && (
              <span className="text-[var(--color-error)] text-xs">
                {errors.providerImage}
              </span>
            )}

            <div className="w-full pt-2">
              <Checkbox
                id="providerStatus"
                name="providerStatus"
                label="Estado del proveedor"
                checked={Boolean(formData?.providerStatus)}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-3 w-full pt-4">
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
                Editar proveedor
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}