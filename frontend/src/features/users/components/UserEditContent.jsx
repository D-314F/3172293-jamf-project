import { useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Select, Checkbox, Button } from "@/shared";
import { userSchema } from "../schemas/userSchema";
import {
  showSuccessAlert,
  showUserErrorAlert,
  showCancelAlert,
} from "@/shared/services/alertService";
import { ArrowLeft, Users, PhoneCall, Save, Camera } from "lucide-react";

function getInitials(name = "") {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "US";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export default function UserEditContent({
  formData,
  setFormData,
  documentTypes = [],
  roles = [],
  onSubmit,
}) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [tempGroup, setTempGroup] = useState(formData.userGroup || "");
  const [tempSecondaryPhone, setTempSecondaryPhone] = useState(
    formData.userSecondaryPhone || ""
  );

  const previewUrl = useMemo(() => {
    if (
      Array.isArray(formData.userImage) &&
      formData.userImage.length > 0 &&
      formData.userImage[0] instanceof File
    ) {
      return URL.createObjectURL(formData.userImage[0]);
    }
    return formData.userImageUrl || null;
  }, [formData.userImage, formData.userImageUrl]);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
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

    const result = userSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
      });
      setErrors(fieldErrors);

      await showUserErrorAlert({
        title: "Campos inválidos",
        text: "Por favor revisa los campos marcados en rojo.",
      });
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      if (onSubmit) {
        await onSubmit({
          ...result.data,
          userGroup: formData.userGroup || null,
          userSecondaryPhone: formData.userSecondaryPhone || null,
        });
      }

      await showSuccessAlert({
        title: "Usuario actualizado",
        text: "Los cambios del usuario se han guardado correctamente.",
        timer: 2000,
      });

      navigate("/dashboard/userList");
    } catch (error) {
      console.error("Error al editar el usuario:", error);
      await showUserErrorAlert({
        title: "Error al actualizar",
        text: error.message || "No se pudo actualizar el usuario.",
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
      navigate("/dashboard/userList");
    }
  };

  const handleSaveGroup = () => {
    setFormData((prev) => ({ ...prev, userGroup: tempGroup }));
    setIsGroupModalOpen(false);
  };

  const handleSaveSecondaryPhone = () => {
    const cleaned = tempSecondaryPhone.replace(/\D/g, "");
    if (cleaned && (cleaned.length < 7 || cleaned.length > 15)) {
      showUserErrorAlert({
        title: "Teléfono secundario inválido",
        text: "Debe contener entre 7 y 15 dígitos numéricos.",
      });
      return;
    }
    setFormData((prev) => ({ ...prev, userSecondaryPhone: cleaned }));
    setIsPhoneModalOpen(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-10 flex flex-col gap-4">
      <div className="flex justify-start">
        <Button
          type="button"
          variant="secondary"
          size="sm"
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
              Editar Usuario
            </h1>
            <p className="text-small text-[var(--color-text-muted)]">
              Modifica los datos personales, cargo operativo, foto de perfil y contacto
            </p>
          </div>

          {/* Columna 1: Identificación y Rol */}
          <div className="flex flex-col gap-4 bg-[var(--color-surface-dark)]/50 p-5 rounded-2xl border border-[var(--color-border)]/60">
            <Select
              label="Tipo de documento"
              name="userDocumentTypes"
              value={formData.userDocumentTypes}
              onChange={handleChange}
              options={documentTypes}
              error={errors.userDocumentTypes}
            />

            <Input
              label="Número de documento"
              type="text"
              name="userDocumentNumber"
              value={formData.userDocumentNumber}
              onChange={handleChange}
              placeholder="Número de documento"
              error={errors.userDocumentNumber}
            />

            <Input
              label="Nombre completo"
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              placeholder="Nombre completo"
              error={errors.userName}
            />

            <Select
              label="Cargo / Tipo de usuario"
              name="userRole"
              value={formData.userRole}
              onChange={handleChange}
              options={roles}
              error={errors.userRole}
            />

            <div className="pt-2 flex flex-col gap-2">
              <Button
                type="button"
                variant="primary"
                size="md"
                className="w-full"
                onClick={() => {
                  setTempGroup(formData.userGroup || "");
                  setIsGroupModalOpen(true);
                }}
              >
                <Users className="w-4 h-4" />
                {formData.userGroup
                  ? `Área: ${formData.userGroup}`
                  : "Asignar área / turno"}
              </Button>
            </div>
          </div>

          {/* Columna 2: Contacto y Fechas */}
          <div className="flex flex-col gap-4 bg-[var(--color-surface-dark)]/50 p-5 rounded-2xl border border-[var(--color-border)]/60">
            <Input
              label="Correo electrónico"
              type="email"
              name="userEmail"
              value={formData.userEmail}
              onChange={handleChange}
              placeholder="Correo electrónico"
              error={errors.userEmail}
            />

            <Input
              label="Número telefónico"
              type="text"
              name="userPhone"
              value={formData.userPhone}
              onChange={handleChange}
              placeholder="Número telefónico"
              error={errors.userPhone}
            />

            <Input
              label="Dirección residencial"
              type="text"
              name="userAddress"
              value={formData.userAddress}
              onChange={handleChange}
              placeholder="Dirección"
              error={errors.userAddress}
            />

            <Input
              label="Fecha inicio laboral"
              type="date"
              name="userStartDate"
              value={formData.userStartDate}
              onChange={handleChange}
              error={errors.userStartDate}
            />

            <Input
              label="Fecha fin laboral (Opcional)"
              type="date"
              name="userEndDate"
              value={formData.userEndDate}
              onChange={handleChange}
              error={errors.userEndDate}
            />
          </div>

          {/* Columna 3: Avatar Interactivo con Cámara + Estado y Acciones */}
          <div className="flex flex-col items-center justify-between gap-5 bg-[var(--color-surface-dark)]/50 p-6 rounded-2xl border border-[var(--color-border)]/60 w-full h-full">
            {/* Avatar clicable con botón flotante de cámara */}
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
                title="Haz clic para cambiar la foto de perfil"
                className="relative group cursor-pointer"
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt={formData.userName || "Avatar de usuario"}
                    className="w-36 h-36 object-cover rounded-full border-4 border-[var(--color-brand)] shadow-xl group-hover:brightness-75 transition"
                  />
                ) : (
                  <div className="w-36 h-36 rounded-full border-4 border-[var(--color-brand)] bg-[var(--color-brand)]/15 flex flex-col items-center justify-center shadow-xl group-hover:bg-[var(--color-brand)]/25 transition">
                    <span className="text-4xl font-bold font-[var(--font-heading)] text-[var(--color-brand)]">
                      {getInitials(formData.userName)}
                    </span>
                    <span className="text-caption text-[var(--color-text-muted)] mt-1">
                      {formData.userRole || "Personal"}
                    </span>
                  </div>
                )}

                {/* Botón flotante de cámara estilo WhatsApp / Material Design 3 */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="absolute bottom-1 right-1 min-w-[48px] min-h-[48px] rounded-full bg-[var(--color-brand)] text-[var(--color-text-primary)] border-2 border-[var(--color-background-inverse)] shadow-lg flex items-center justify-center hover:scale-110 transition cursor-pointer"
                  aria-label="Cambiar foto de perfil"
                >
                  <Camera className="w-5 h-5" />
                </button>
              </div>

              <span className="text-xs text-[var(--color-text-muted)]">
                Toca el ícono de cámara para subir foto
              </span>
            </div>

            <div className="w-full pt-1">
              <Checkbox
                id="userActive"
                name="isActive"
                label={`Estado del usuario (${
                  formData.isActive ? "Activo" : "Inactivo"
                })`}
                checked={Boolean(formData.isActive)}
                onChange={handleChange}
              />
            </div>

            <div className="w-full">
              <Button
                type="button"
                variant="primary"
                size="md"
                className="w-full"
                onClick={() => {
                  setTempSecondaryPhone(formData.userSecondaryPhone || "");
                  setIsPhoneModalOpen(true);
                }}
              >
                <PhoneCall className="w-4 h-4" />
                {formData.userSecondaryPhone
                  ? `Tel. Secundario: ${formData.userSecondaryPhone}`
                  : "Agregar número secundario"}
              </Button>
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
                <Save className="w-4 h-4" />
                {loading ? "Guardando..." : "Aplicar Cambios"}
              </Button>
            </div>
          </div>
        </div>
      </form>

      {/* Modal Asignar Área / Turno Operativo */}
      {isGroupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[var(--color-background-inverse)] border border-[var(--color-brand)] rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <h2 className="text-lg font-bold font-[var(--font-heading)] text-[var(--color-text-inverse)]">
              Asignar Área / Turno Operativo
            </h2>
            <p className="text-small text-[var(--color-text-muted)]">
              El Rol define los permisos del sistema; el Área / Turno organiza al personal por estación de trabajo:
            </p>
            <select
              value={tempGroup}
              onChange={(e) => setTempGroup(e.target.value)}
              className="w-full rounded-xl bg-[var(--color-surface-dark)] border border-[var(--color-border)] text-[var(--color-text-inverse)] px-4 py-3 text-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
            >
              <option value="">Sin área asignada</option>
              <option value="Grupo Administración POS">
                Grupo Administración POS
              </option>
              <option value="Grupo Caja y Facturación">
                Grupo Caja y Facturación
              </option>
              <option value="Grupo Cocina y Menú">Grupo Cocina y Menú</option>
              <option value="Grupo Servicio de Mesas">
                Grupo Servicio de Mesas
              </option>
              <option value="Grupo Bodega e Inventario">
                Grupo Bodega e Inventario
              </option>
            </select>
            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setIsGroupModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleSaveGroup}
              >
                Guardar área
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Teléfono Secundario */}
      {isPhoneModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[var(--color-background-inverse)] border border-[var(--color-brand)] rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <h2 className="text-lg font-bold font-[var(--font-heading)] text-[var(--color-text-inverse)]">
              Número Telefónico Secundario
            </h2>
            <p className="text-small text-[var(--color-text-muted)]">
              Ingresa un número de contacto alternativo o de emergencia:
            </p>
            <Input
              label="Teléfono secundario"
              type="text"
              name="tempSecondaryPhone"
              value={tempSecondaryPhone}
              onChange={(e) => setTempSecondaryPhone(e.target.value)}
              placeholder="Ej: 3158901234"
            />
            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setIsPhoneModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleSaveSecondaryPhone}
              >
                Guardar teléfono
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}