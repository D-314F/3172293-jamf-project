import { useState } from "react";
import userProfile from "@/assets/images/user-profile.png";
import { useNavigate } from "react-router-dom";
import { Select, Input, Button, Checkbox } from "@/shared";
import { ArrowLeft } from "lucide-react";
import documentTypes from "../../../data/selects/documentsTypes.json";
import userTypes from "../../../data/selects/userTypes.json";
import { userSchema } from "../schemas/userSchema";
import { showSuccessAlert, showCancelAlert } from "@/shared/services/alertService"; 

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

  const handleSubmit = async (e) => {
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

    try {
      if (onSubmit) {
        await onSubmit(formData);
      }

      await showSuccessAlert({
        title: "Usuario actualizado",
        text: "Los datos del usuario se han actualizado correctamente.",
        timer: 2000,
      });

      navigate(-1);
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      setErrors({ submit: "Error al actualizar el usuario" });
    }
  };

  const handleCancel = async () => {
    const result = await showCancelAlert({
      title: "¿Deseas cancelar?",
      text: "Los cambios realizados no se guardarán.",
      timer: 3000,
    });

    if (result.isConfirmed) {
      navigate(-1);
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto flex flex-col gap-4">
      
      <div className="flex justify-start">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => navigate(-1)}
          className="!w-auto flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Atrás
        </Button>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit}>
        <div className="bg-[var(--color-background-inverse)] text-[var(--color-text-inverse)] rounded-3xl p-6 sm:p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-center border border-[var(--color-brand)]">
          
          {/* Título */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3 flex items-center gap-3 mb-2">
            <h1 className="text-[var(--text-display)] font-[var(--font-heading)]">
              Editar Usuario
            </h1>
          </div>

          
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Tipo de documento"
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
              type="text"
              name="userBusinessEmail"
              value={formData?.userBusinessEmail || ""}
              onChange={handleChange}
              placeholder="Correo empresarial"
              error={errors.userBusinessEmail}
            />

            <Input
              label="Número de documento"
              type="text"
              name="userDocumentNumber"
              value={formData?.userDocumentNumber || ""}
              onChange={handleChange}
              placeholder="Número Documento"
              error={errors.userDocumentNumber}
            />

            <Input
              label="Correo electrónico"
              type="text"
              name="userEmail"
              value={formData?.userEmail || ""}
              onChange={handleChange}
              placeholder="Correo electrónico"
              error={errors.userEmail}
            />

            <Input
              label="Nombre completo"
              type="text"
              name="userName"
              value={formData?.userName || ""}
              onChange={handleChange}
              placeholder="Nombre completo"
              error={errors.userName}
            />

            <Input
              label="Número telefónico"
              type="text"
              name="userPhone"
              value={formData?.userPhone || ""}
              onChange={handleChange}
              placeholder="Número telefónico"
              error={errors.userPhone}
            />

            <Select
              label="Tipo de usuario"
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
              type="text"
              name="userAddress"
              value={formData?.userAddress || ""}
              onChange={handleChange}
              placeholder="Dirección residencial"
              error={errors.userAddress}
            />

            <Input
              label="Fecha inicio laboral"
              type="text"
              name="userStartDate"
              value={formData?.userStartDate || ""}
              onChange={handleChange}
              placeholder="Fecha inicio laboral"
              error={errors.userStartDate}
            />

            <Input
              label="Fecha fin laboral"
              type="text"
              name="userEndDate"
              value={formData?.userEndDate || ""}
              onChange={handleChange}
              placeholder="Fecha fin laboral"
              error={errors.userEndDate}
            />

            <Button
              type="button"
              variant="primary"
              size="md"
              className="w-full md:col-span-2 mt-2"
            >
              Agregar grupo
            </Button>
          </div>

          
          <div className="flex flex-col items-center justify-center gap-4 lg:order-last">
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
              variant="primary"
              size="md"
              className="w-full"
            >
              Agregar Teléfono Secundario
            </Button>
            
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={handleCancel}
              className="w-full"
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full"
            >
              Aplicar Cambios
            </Button>
          </div>

        </div>
      </form>
    </div>
  );
}