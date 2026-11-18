import { useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, Plus } from "lucide-react";
import { Input, Select, Checkbox, Button } from "@/shared";
import { providerSchema } from "../schemas/providerSchema";
import { documentTypes, providerProducts } from "../data/providersValue";
import {
  showSuccessAlert,
  showUserErrorAlert,
  showCancelAlert,
} from "@/shared/services/alertService";
import { createProvider } from "../services/providerServices";

function getInitials(name = "") {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "PR";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export default function ProviderCreateForm() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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

  const previewUrl = useMemo(() => {
    if (
      Array.isArray(formData.userImage) &&
      formData.userImage.length > 0 &&
      formData.userImage[0] instanceof File
    ) {
      return URL.createObjectURL(formData.userImage[0]);
    }
    return null;
  }, [formData.userImage]);

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

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setFormData((prev) => ({ ...prev, userImage: files }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = providerSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
      });
      setErrors(fieldErrors);

      await showUserErrorAlert({
        title: "Error al crear el proveedor",
        text: "Por favor, completa correctamente todos los campos requeridos.",
      });
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await createProvider({
        ...result.data,
        userImage: formData.userImage,
      });

      await showSuccessAlert({
        title: "Proveedor creado",
        text: "El proveedor se ha registrado correctamente.",
        timer: 2000,
      });

      navigate("/dashboard/providerList");
    } catch (error) {
      console.error("Error al crear el Proveedor", error);
      await showUserErrorAlert({
        title: "Error inesperado",
        text: error.message || "Ocurrió un problema al procesar la solicitud.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    const result = await showCancelAlert({
      title: "¿Deseas cancelar?",
      text: "Los cambios no guardados se perderán.",
      timer: 3000,
    });

    if (result.isConfirmed) {
      navigate(-1);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-10 flex flex-col gap-4">
      <div className="flex justify-start">
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
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-[var(--color-background-inverse)] text-[var(--color-text-inverse)] rounded-3xl p-6 sm:p-10 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start border border-[var(--color-brand)]/60 shadow-2xl">
          {/* Encabezado */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col gap-1 border-b border-[var(--color-border)] pb-4">
            <h1 className="text-xl sm:text-2xl font-bold font-[var(--font-heading)] text-[var(--color-text-inverse)]">
              Registrar Proveedor
            </h1>
            <p className="text-small text-[var(--color-text-muted)]">
              Ingresa los datos comerciales y tributarios del nuevo aliado de abastecimiento
            </p>
          </div>

          {/* Columna 1 */}
          <div className="flex flex-col gap-4 bg-[var(--color-surface-dark)]/50 p-5 rounded-2xl border border-[var(--color-border)]/60">
            <Select
              label="Tipo de documento"
              name="providerDocumentType"
              value={formData.providerDocumentType}
              onChange={handleChange}
              options={documentTypes}
              error={errors.providerDocumentType}
            />

            <Input
              label="Número de documento / NIT"
              name="providerDocumentNumber"
              value={formData.providerDocumentNumber}
              onChange={handleChange}
              placeholder="Ej: 9004821901"
              error={errors.providerDocumentNumber}
            />

            <Input
              label="Nombre o Razón Social"
              name="providerName"
              value={formData.providerName}
              onChange={handleChange}
              placeholder="Solo letras y espacios"
              error={errors.providerName}
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

          {/* Columna 2 */}
          <div className="flex flex-col gap-4 bg-[var(--color-surface-dark)]/50 p-5 rounded-2xl border border-[var(--color-border)]/60">
            <Input
              label="Correo electrónico empresarial"
              name="providerEmail"
              value={formData.providerEmail}
              onChange={handleChange}
              placeholder="ventas@proveedor.com"
              error={errors.providerEmail}
            />

            <Input
              label="Número telefónico"
              name="providerPhone"
              value={formData.providerPhone}
              onChange={handleChange}
              placeholder="Ej: 3104567890"
              error={errors.providerPhone}
            />

            <Input
              label="Dirección comercial / Bodega"
              name="providerAddress"
              value={formData.providerAddress}
              onChange={handleChange}
              placeholder="Dirección física"
              error={errors.providerAddress}
            />

            <Input
              label="Observaciones de entrega"
              name="providerObservations"
              value={formData.providerObservations}
              onChange={handleChange}
              placeholder="Horarios, condiciones de entrega, etc."
              error={errors.providerObservations}
            />
          </div>

          {/* Columna 3: Avatar Circular con Cámara + Estado y Botones */}
          <div className="flex flex-col items-center justify-between gap-5 bg-[var(--color-surface-dark)]/50 p-6 rounded-2xl border border-[var(--color-border)]/60 w-full h-full">
            <div className="flex flex-col items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                title="Haz clic para subir el logo del proveedor"
                className="relative group cursor-pointer"
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Vista previa logo"
                    className="w-36 h-36 object-cover rounded-full border-4 border-[var(--color-brand)] shadow-xl group-hover:brightness-75 transition"
                  />
                ) : (
                  <div className="w-36 h-36 rounded-full border-4 border-[var(--color-brand)] bg-[var(--color-brand)]/15 flex flex-col items-center justify-center shadow-xl group-hover:bg-[var(--color-brand)]/25 transition">
                    <span className="text-4xl font-bold font-[var(--font-heading)] text-[var(--color-brand)]">
                      {getInitials(formData.providerName)}
                    </span>
                    <span className="text-caption text-[var(--color-text-muted)] mt-1">
                      Aliado JAMF
                    </span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="absolute bottom-1 right-1 min-w-[48px] min-h-[48px] rounded-full bg-[var(--color-brand)] text-[var(--color-text-primary)] border-2 border-[var(--color-background-inverse)] shadow-lg flex items-center justify-center hover:scale-110 transition cursor-pointer"
                  aria-label="Subir logo del proveedor"
                >
                  <Camera className="w-5 h-5" />
                </button>
              </div>

              <span className="text-medium text-[var(--color-text-muted)] text-center">
                Toca el ícono de cámara para subir logo
              </span>
            </div>

            <div className="w-full pt-1">
              <Checkbox
                id="providerStatus"
                name="providerStatus"
                label={`Estado del proveedor (${
                  formData.providerStatus ? "Activo" : "Inactivo"
                })`}
                checked={Boolean(formData.providerStatus)}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-4 w-full pt-6 border-t border-[var(--color-border)]/60">
              <Button
                type="button"
                variant="secondary"
                size="md"
                className="w-full"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full"
                disabled={loading}
              >
                <Plus className="w-4 h-4" />
                {loading ? "Creando..." : "Crear Proveedor"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}