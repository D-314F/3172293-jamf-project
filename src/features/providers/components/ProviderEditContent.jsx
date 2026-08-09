import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Select, Input, Button, Checkbox, FileInput } from "@/shared";
import documentTypes from "../../../data/selects/documentsTypes.json";
import productCategories from "../../../data/selects/productCategories.json";
import { providerSchema } from "../schemas/providerSchema";

export default function ProviderEditContent({
  formData = {},
  setFormData,
  onSubmit,
}) {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  // 🔹 Manejo de cambios
  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 🔹 Validación con Zod
  const handleSubmit = (e) => {
    e.preventDefault();
    const result = providerSchema.safeParse(formData);

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
    onSubmit ? onSubmit(formData) : console.log("Datos de proveedor válidos:", formData);
  };

  return (
    <div className="p-8">
      {/* Botón Volver */}
      <Button
        type="button"
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 bg-[var(--color-secondary-950)] text-[var(--color-text-inverse)] px-4 py-2 rounded-md mb-6 hover:bg-[var(--color-error-hover)] transition"
      >
        <ArrowLeft size={16} /> Atrás
      </Button>

      {/* Formulario */}
      <form onSubmit={handleSubmit}>
        <div className="bg-[var(--color-background-inverse)] text-[var(--color-black)] rounded-3xl p-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-center border border-[var(--color-brand)]">
          <div className="col-span-3 flex items-center gap-3 mb-4">
            <span className="text-[var(--text-display)] font-[var(--font-heading)]">
              Editar Proveedor
            </span>
          </div>

          {/* Campos de Entrada */}
          <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
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

          {/* Panel lateral */}
          <div className="flex flex-col items-center justify-center gap-4">
            <FileInput
              value={formData.providerImage}
              onChange={(files) =>
                setFormData((prev) => ({ ...prev, providerImage: files }))
              }
              multiple={false}
            />
            {errors.providerImage && (
              <span className="text-red-400 text-xs">{errors.providerImage}</span>
            )}

            <Checkbox
              id="providerStatus"
              name="providerStatus"
              label="Estado del proveedor"
              checked={Boolean(formData?.providerStatus)}
              onChange={handleChange}
            />

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
