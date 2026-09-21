import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Select, Checkbox, Button, FileInput } from "@/shared";
import { providerSchema } from "../schemas/providerSchema";
import { documentTypes, providerProducts } from "../data/providersValue"; // Importación limpia
import { showSuccessAlert, showCancelAlert } from "@/shared/services/alertService"; 


export default function ProviderCreateForm() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    providerDocumentType: "",
    providerDocumentNumber: "",
    providerName: "",
    providerObservations: "",
    providerProducts: "",
    providerPhone: "",
    providerEmail: "",
    providerAddress: "",
    providerStatus: true,
    userImage: [],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
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
        // FIX 2: Se corrigió la sintaxis de los comentarios de prueba
        // const response = await createUser(result.data);
        // console.log("Proveedor Creado:", response);
  
        // Feedback básico al Proveedor 
        await showSuccessAlert({
          title: "Proveedor creado",
          text: "El Proveedor se ha creado correctamente",
          timer: 2000,
        });
  
        // Navegamos a la vista anterior
        navigate(-1);
        
      } catch (error) {
        console.error("Error al crear el Proveedor", error);
        setErrors({ submit: "Error al crear el Proveedor" });
      }
  
      
    };
        const handleCancel = async () => {
          // Desplegamos la alerta de confirmación
          const result = await showCancelAlert({
              title: "Cancelado",
              text: "Los cambios no guardados se perderán.",
              timer: 3000,
          });
      
          if (result.isConfirmed) {
              // Navegamos a la vista anterior
              navigate(-1);
          }
      };
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-20 md:pt-28 pb-10">
      
      {/* Header superior alineado con título visible */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <Button
          variant="secondary"
          size="sm"
          type="button"
          onClick={() => navigate(-1)}
        >
          Atrás
        </Button>
        <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-text-inverse)] text-right">
          Registrar proveedores
        </h1>
      </div>

      {/* Contenedor principal */}
      <div className="rounded-2xl md:rounded-3xl border border-[var(--color-brand)] bg-[var(--color-background-inverse)] p-5 sm:p-8 md:p-10 shadow-lg">
        
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {/* Bloque 1 */}
          <div className="flex flex-col gap-4">
            <Select
              label="Tipo de documento"
              name="providerDocumentType"
              value={formData.providerDocumentType}
              onChange={handleChange}
              options={documentTypes}
              error={errors.providerDocumentType}
            />

            <Input
              label="Número documento"
              name="providerDocumentNumber"
              value={formData.providerDocumentNumber}
              onChange={handleChange}
              placeholder="Número documento"
              error={errors.providerDocumentNumber}
            />

            <Input
              label="Nombre completo"
              name="providerName"
              value={formData.providerName}
              onChange={handleChange}
              placeholder="Nombre completo"
              error={errors.providerName}
            />

            <Input
              label="Observaciones"
              name="providerObservations"
              value={formData.providerObservations}
              onChange={handleChange}
              placeholder="Observaciones"
              error={errors.providerObservations}
            />

            <Select
              label="Productos que suministra"
              name="providerProducts"
              value={formData.providerProducts}
              onChange={handleChange}
              options={providerProducts}
              error={errors.providerProducts}
            />
          </div>

          {/* Bloque 2 */}
          <div className="flex flex-col gap-4">
            <Input
              label="Número de contacto"
              name="providerPhone"
              value={formData.providerPhone}
              onChange={handleChange}
              placeholder="Número de contacto"
              error={errors.providerPhone}
            />

            <Input
              label="Correo electrónico empresa"
              name="providerEmail"
              value={formData.providerEmail}
              onChange={handleChange}
              placeholder="Correo electrónico empresa"
              error={errors.providerEmail}
            />

            <Input
              label="Dirección"
              name="providerAddress"
              value={formData.providerAddress}
              onChange={handleChange}
              placeholder="Dirección"
              error={errors.providerAddress}
            />

            <div className="pt-2">
              <Checkbox
                id="providerStatus"
                name="providerStatus"
                label="Estado del proveedor"
                checked={formData.providerStatus}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Bloque 3 */}
          <div className="flex flex-col justify-between gap-6 md:col-span-2 lg:col-span-1">
            <div className="flex flex-col items-start gap-3 w-full">
              <span className="text-[var(--color-text-inverse)] text-sm font-medium">
                Documentos / Adjuntos
              </span>
              <FileInput
                className="border-[var(--color-brand)] w-full"
                value={formData.userImage}
                onChange={(files) =>
                  setFormData((prev) => ({ ...prev, userImage: files }))
                }
                multiple={true}
              />
              {errors.userImage && (
                <span className="text-red-400 text-xs">
                  {errors.userImage}
                </span>
              )}
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
              <Button type="submit" variant="primary">
                Crear proveedor
              </Button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}