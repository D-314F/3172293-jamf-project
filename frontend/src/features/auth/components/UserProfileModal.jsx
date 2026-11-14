import { useState } from "react";
import { Modal, Button, Input } from "@/shared";
import { showSuccessAlert } from "@/shared/services/alertService";
import {
  Mail,
  Shield,
  UserCheck,
  Building2,
  IdCard,
  Phone,
  MapPin,
  Calendar,
  Layers,
  KeyRound,
  Copy,
  Check,
  Pencil,
  Lock,
} from "lucide-react";
import { getUserInitials, updateProfile } from "../services/authService";

const MODULE_LABELS = {
  users: "Usuarios",
  dishes: "Platos",
  orders: "Órdenes",
  providers: "Proveedores",
  inventory: "Inventario",
  permissions: "Permisos",
};

function formatDate(dateString) {
  if (!dateString) return "No registrada";
  const [year, month, day] = String(dateString).split("T")[0].split("-");
  if (!year || !month || !day) return dateString;

  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function ProfileInfoRow({ icon: Icon, label, value, copyValue }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!copyValue || !navigator?.clipboard) return;
    await navigator.clipboard.writeText(copyValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="flex items-start justify-between gap-3 rounded-2xl bg-[var(--color-gray-950)] border border-[var(--color-gray-800)]/70 px-4 py-2.5">
      <div className="flex items-start gap-3 min-w-0">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--color-brand)]/12 text-[var(--color-brand)]">
          <Icon className="w-4 h-4" />
        </span>

        <div className="min-w-0">
          <p className="text-small text-[var(--color-gray-300)] leading-tight">
            {label}
          </p>
          <p className="text-medium font-medium text-[var(--color-text-inverse)] break-words mt-0.5 leading-snug">
            {value}
          </p>
        </div>
      </div>

      {copyValue && (
        <button
          type="button"
          onClick={handleCopy}
          title={`Copiar ${label.toLowerCase()}`}
          className="shrink-0 p-1.5 rounded-lg text-[var(--color-gray-300)] hover:text-[var(--color-brand)] hover:bg-white/5 transition-colors cursor-pointer"
        >
          {copied ? (
            <Check className="w-4 h-4 text-emerald-400" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      )}
    </div>
  );
}

export default function UserProfileModal({
  isOpen,
  onClose,
  profile,
  allowedModules = null,
  onProfileUpdated = null,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    userPhone: "",
    userAddress: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen || !profile) return null;

  const initials = getUserInitials(profile.userName);
  const normalizedType = (profile.userType || "").trim().toLowerCase();

  const extraGroups = Array.isArray(profile.groups)
    ? profile.groups.filter(
        (group) => group && group.trim().toLowerCase() !== normalizedType
      )
    : [];

  const activeModules = allowedModules
    ? Object.entries(MODULE_LABELS)
        .filter(([key]) => Boolean(allowedModules[key]))
        .map(([, label]) => label)
    : [];

  const documentValue =
    `${profile.userDocumentTypes || ""} ${profile.userDocumentNumber || ""}`.trim() ||
    "No registrado";

  const handleClose = () => {
    setIsEditing(false);
    setFieldErrors({});
    setSubmitError("");
    onClose();
  };

  const handleStartEdit = () => {
    setFormData({
      userPhone: profile.userPhone || "",
      userAddress: profile.userAddress || "",
    });
    setFieldErrors({});
    setSubmitError("");
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    setSubmitError("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const errors = {};
    const phone = formData.userPhone.trim();
    const address = formData.userAddress.trim();

    if (!/^[0-9]{10}$/.test(phone)) {
      errors.userPhone = "El teléfono debe tener 10 dígitos";
    }

    if (address.length < 5) {
      errors.userAddress = "La dirección debe tener mínimo 5 caracteres";
    } else if (address.length > 100) {
      errors.userAddress = "La dirección es demasiado larga";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      setIsSaving(true);
      const updatedProfile = await updateProfile({
        userPhone: phone,
        userAddress: address,
      });

      onProfileUpdated?.(updatedProfile);
      setIsEditing(false);

      await showSuccessAlert({
        title: "Contacto actualizado",
        text: "Tu teléfono y dirección se actualizaron correctamente.",
        timer: 1800,
      });
    } catch (error) {
      setSubmitError(error.message || "No se pudo actualizar tu contacto");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Mi Perfil"
      className="md:max-w-3xl"
    >
      <div className="flex flex-col gap-4">
        {/* Contenedor Principal: Vertical en Mobile, Horizontal en Desktop */}
        <div className="flex flex-col md:flex-row gap-6 md:items-start">
          {/* Columna Izquierda: Identidad + Rol + Accesos */}
          <div className="md:w-5/12 flex flex-col items-center justify-start text-center gap-4 p-5 rounded-2xl bg-[var(--color-gray-950)] border border-[var(--color-brand)]/25">
            <div className="flex flex-col items-center gap-3 w-full">
              {profile.userAvatarUrl ? (
                <img
                  src={profile.userAvatarUrl}
                  alt={profile.userName}
                  className="w-20 h-20 rounded-full object-cover border-2 border-[var(--color-brand)] shadow-lg"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-[var(--color-brand)] text-[var(--color-text-primary)] flex items-center justify-center text-2xl font-bold shadow-lg border-2 border-[var(--color-text-inverse)]/20">
                  {initials}
                </div>
              )}

              <div className="space-y-1 max-w-full">
                <h3 className="text-subtitle font-bold text-[var(--color-text-inverse)] leading-tight">
                  {profile.userName}
                </h3>
                <p className="text-medium text-[var(--color-gray-300)] flex items-center justify-center gap-1.5 break-all">
                  <Mail className="w-4 h-4 shrink-0 text-[var(--color-brand)]" />
                  <span>{profile.userEmail}</span>
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-small font-semibold bg-[var(--color-brand)] text-[var(--color-text-primary)]">
                  <Shield className="w-3.5 h-3.5" />
                  {profile.userType}
                </span>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-small font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/35">
                  <UserCheck className="w-3.5 h-3.5" />
                  {profile.isActive ? "Activo" : "Inactivo"}
                </span>

                {profile.isSuperuser && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-small font-medium bg-amber-500/15 text-amber-200 border border-amber-400/35">
                    <KeyRound className="w-3.5 h-3.5" />
                    Superusuario
                  </span>
                )}
              </div>
            </div>

            {allowedModules && (
              <div className="w-full pt-3 border-t border-[var(--color-gray-800)]/80">
                <p className="text-small text-[var(--color-gray-300)] mb-2.5 text-center">
                  Tus accesos en el sistema
                </p>
                {activeModules.length > 0 ? (
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {activeModules.map((mod) => (
                      <span
                        key={mod}
                        className="px-2.5 py-1 rounded-full text-small font-medium bg-white/8 text-[var(--color-text-inverse)] border border-white/10"
                      >
                        {mod}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-small text-center text-[var(--color-gray-300)]">
                    Solo vista pública y menú
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Columna Derecha: Sin justify-between para eliminar el espacio muerto */}
          <div className="md:w-7/12 flex flex-col justify-start gap-3">
            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-3.5">
                <div className="flex items-start gap-2 rounded-xl bg-[var(--color-brand)]/10 border border-[var(--color-brand)]/30 px-3.5 py-2.5 text-small text-[var(--color-gray-200)]">
                  <Lock className="w-4 h-4 text-[var(--color-brand)] shrink-0 mt-0.5" />
                  <span>
                    Por seguridad, tu cargo, documento y correo institucional solo
                    los modifica un administrador.
                  </span>
                </div>

                <Input
                  label="Teléfono"
                  htmlFor="profile-userPhone"
                  name="userPhone"
                  type="tel"
                  maxLength={10}
                  placeholder="Ej: 3124567890"
                  value={formData.userPhone}
                  onChange={handleChange}
                  error={fieldErrors.userPhone}
                />

                <Input
                  label="Dirección"
                  htmlFor="profile-userAddress"
                  name="userAddress"
                  type="text"
                  maxLength={100}
                  placeholder="Ej: Av. Simón Bolívar #14-20"
                  value={formData.userAddress}
                  onChange={handleChange}
                  error={fieldErrors.userAddress}
                />

                {submitError && (
                  <p className="text-medium text-[var(--color-brand-soft)]">
                    {submitError}
                  </p>
                )}

                <div className="pt-2 flex flex-col-reverse sm:flex-row gap-2.5">
                  <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    onClick={() => setIsEditing(false)}
                    disabled={isSaving}
                    className="w-full sm:flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    disabled={isSaving}
                    className="w-full sm:flex-1"
                  >
                    {isSaving ? "Guardando..." : "Guardar cambios"}
                  </Button>
                </div>
              </form>
            ) : (
              <>
                <div className="flex items-center justify-between px-1">
                  <span className="text-small font-semibold uppercase tracking-wide text-[var(--color-gray-300)]">
                    Datos de cuenta
                  </span>
                  <button
                    type="button"
                    onClick={handleStartEdit}
                    className="inline-flex items-center gap-1.5 text-small font-semibold text-[var(--color-brand)] hover:underline cursor-pointer"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Editar contacto
                  </button>
                </div>

                <div className="flex flex-col gap-2.5">
                  {extraGroups.length > 0 && (
                    <ProfileInfoRow
                      icon={Layers}
                      label="Grupos de permisos"
                      value={extraGroups.join(", ")}
                    />
                  )}

                  <ProfileInfoRow
                    icon={Building2}
                    label="Correo empresarial"
                    value={profile.userBusinessEmail || "No registrado"}
                    copyValue={profile.userBusinessEmail}
                  />

                  <ProfileInfoRow
                    icon={IdCard}
                    label="Documento"
                    value={documentValue}
                  />

                  <ProfileInfoRow
                    icon={Phone}
                    label="Teléfono"
                    value={profile.userPhone || "No registrado"}
                  />

                  <ProfileInfoRow
                    icon={MapPin}
                    label="Dirección"
                    value={profile.userAddress || "No registrada"}
                  />

                  <ProfileInfoRow
                    icon={Calendar}
                    label="Fecha de ingreso"
                    value={formatDate(profile.userStartDate)}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Botón de cierre único cuando no está editando */}
        {!isEditing && (
          <div className="flex justify-end pt-1">
            <Button
              variant="primary"
              size="md"
              onClick={handleClose}
              className="w-full md:w-40"
            >
              Cerrar
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}