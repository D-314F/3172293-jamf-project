import { useState } from "react";
import userProfile from "@/assets/images/user-profile.png";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Select, Input, Button, Checkbox } from "@/shared";
import documentTypes from "../../../data/selects/documentsTypes.json";
import userTypes from "../../../data/selects/userTypes.json";
import { userSchema } from "../schemas/userSchema";

export default function UserEditContent({
  formData = {},
  setFormData,
  user = {},
  onSubmit,
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = userSchema.safeParse(formData);

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
    onSubmit ? onSubmit(formData) : console.log("Datos de usuario válidos:", formData);
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
              Editar Usuario
            </span>
          </div>

          {/* Campos de Entrada */}
          <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Tipo de documento"
              labelClassName="text-[var(--color-text-inverse)]"
              name="userDocumentTypes"
              value={formData?.userDocumentTypes || ""}
              options={documentTypes.map((doc) => ({
                value: doc.id,
                label: doc.label,
              }))}
              onChange={handleChange}
              error={errors.userDocumentTypes}
            />

            <Input
              label="Correo empresarial"
              labelClassName="text-[var(--color-text-inverse)]"
              type="text"
              name="userBusinessEmail"
              value={formData?.userBusinessEmail || ""}
              onChange={handleChange}
              placeholder="Correo empresarial"
              error={errors.userBusinessEmail}
            />

            <Input
              label="Número de documento"
              labelClassName="text-[var(--color-text-inverse)]"
              type="text"
              name="userDocumentNumber"
              value={formData?.userDocumentNumber || ""}
              onChange={handleChange}
              placeholder="Número Documento"
              error={errors.userDocumentNumber}
            />

            <Input
              label="Correo electrónico"
              labelClassName="text-[var(--color-text-inverse)]"
              type="text"
              name="userEmail"
              value={formData?.userEmail || ""}
              onChange={handleChange}
              placeholder="Correo electrónico"
              error={errors.userEmail}
            />

            <Input
              label="Nombre completo"
              labelClassName="text-[var(--color-text-inverse)]"
              type="text"
              name="userName"
              value={formData?.userName || ""}
              onChange={handleChange}
              placeholder="Nombre completo"
              error={errors.userName}
            />

            <Input
              label="Número telefónico"
              labelClassName="text-[var(--color-text-inverse)]"
              type="text"
              name="userPhone"
              value={formData?.userPhone || ""}
              onChange={handleChange}
              placeholder="Número telefónico"
              error={errors.userPhone}
            />

            <Select
              label="Tipo de usuario"
              labelClassName="text-[var(--color-text-inverse)]"
              name="userType"
              value={formData?.userType || ""}
              options={userTypes.map((type) => ({
                value: type.id,
                label: type.label,
              }))}
              onChange={handleChange}
              error={errors.userType}
            />

            <Input
              label="Dirección residencial"
              labelClassName="text-[var(--color-text-inverse)]"
              type="text"
              name="userAddress"
              value={formData?.userAddress || ""}
              onChange={handleChange}
              placeholder="Dirección residencial"
              error={errors.userAddress}
            />

            <Input
              label="Fecha inicio laboral"
              labelClassName="text-[var(--color-text-inverse)]"
              type="text"
              name="userStartDate"
              value={formData?.userStartDate || ""}
              onChange={handleChange}
              placeholder="Fecha inicio laboral"
              error={errors.userStartDate}
            />

            <Input
              label="Fecha fin laboral"
              labelClassName="text-[var(--color-text-inverse)]"
              type="text"
              name="userEndDate"
              value={formData?.userEndDate || ""}
              onChange={handleChange}
              placeholder="Fecha fin laboral"
              error={errors.userEndDate}
            />

            <Button
              type="button"
              className="bg-[var(--color-brand)] text-[var(--color-text-primary)] font-[var(--font-heading)] px-4 py-2 rounded-md hover:bg-[var(--color-brand-hover)] transition w-full"
            >
              Agregar grupo
            </Button>
          </div>

          {/* Panel lateral */}
          <div className="flex flex-col items-center justify-center gap-4">
            <img
              src={userProfile}
              alt={user?.userName || 'Foto de usuario'}
              className="w-48 h-48 object-cover rounded-xl border-4 border-[var(--color-brand)]"
            />

            <div className="flex flex-col items-center gap-2">
              <Checkbox
                id="isActive"
                name="isActive"
                label="Estado del usuario"
                checked={Boolean(formData?.isActive)}
                onChange={handleChange}
              />
            </div>

            <Button
              type="button"
              className="bg-[var(--color-brand-hover)] text-[var(--color-text-primary)] px-4 py-2 rounded-md hover:bg-[var(--color-brand-active)] transition w-full"
            >
              Agregar Teléfono Secundario
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