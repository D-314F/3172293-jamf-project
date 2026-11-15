import { useNavigate } from "react-router-dom";
import {
  IdCard,
  Briefcase,
  Image as ImageIcon,
  Shield,
  PhoneCall,
  Pencil,
} from "lucide-react";
import { Input, Button } from "@/shared";
import { getUserInitials } from "@/features/auth/services/authService";
import { user_groups_function } from "../data/users";
import documentTypes from "../../../data/selects/documentsTypes.json";

export default function UserDetailForm({ user = {} }) {
  const navigate = useNavigate();
  const isActivo = Boolean(user?.isActive ?? user?.active ?? user?.is_active ?? true);

  const matchedDoc = documentTypes.find(
    (d) => d.id === user?.userDocumentTypes || d.label === user?.userDocumentTypes
  );
  const documentLabel = matchedDoc
    ? matchedDoc.label
    : user?.userDocumentTypes || user?.documentType || "No registrado";

  const groupLabel =
    user_groups_function.find(
      (g) => g.value === user?.userGroup || g.label === user?.userGroup
    )?.label ||
    user?.userGroup ||
    "Sin grupo asignado";

  const avatarSrc = user?.userAvatarUrl || null;
  const initials = getUserInitials(user?.userName || user?.fullName || "");

  return (
    <div className="rounded-3xl border border-[var(--color-brand)]/40 bg-[var(--color-background-inverse)] p-5 sm:p-8 shadow-2xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna 1: Identidad y Cargo */}
        <div className="flex flex-col gap-4 p-5 rounded-2xl bg-[var(--color-surface-dark)] border border-[var(--color-border)]/40">
          <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border)]/30">
            <IdCard className="w-5 h-5 text-[var(--color-brand)]" />
            <h2 className="text-base font-bold font-[var(--font-heading)] text-[var(--color-text-inverse)]">
              Identidad y Cargo
            </h2>
          </div>

          <Input
            label="Tipo de documento"
            value={documentLabel}
            readOnly
            disabled
          />

          <Input
            label="Número de documento"
            value={user?.userDocumentNumber || user?.documentNumber || ""}
            readOnly
            disabled
          />

          <Input
            label="Nombre completo"
            value={user?.userName || user?.fullName || ""}
            readOnly
            disabled
          />

          <Input
            label="Cargo / Tipo de usuario"
            value={user?.userType || "Usuario"}
            readOnly
            disabled
          />

          <div className="pt-1">
            <span className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5">
              Grupo de permisos asignado
            </span>
            <div className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-background-inverse)] border border-[var(--color-brand)]/35 text-[var(--color-brand)] text-sm font-semibold flex items-center gap-2">
              <Shield className="w-4 h-4 shrink-0" />
              <span>{groupLabel}</span>
            </div>
          </div>
        </div>

        {/* Columna 2: Contacto y Contrato */}
        <div className="flex flex-col gap-4 p-5 rounded-2xl bg-[var(--color-surface-dark)] border border-[var(--color-border)]/40">
          <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border)]/30">
            <Briefcase className="w-5 h-5 text-[var(--color-brand)]" />
            <h2 className="text-base font-bold font-[var(--font-heading)] text-[var(--color-text-inverse)]">
              Contacto y Contrato
            </h2>
          </div>

          <Input
            label="Correo empresarial"
            value={user?.userBusinessEmail || user?.businessEmail || "No registrado"}
            readOnly
            disabled
          />

          <Input
            label="Correo electrónico (Login)"
            value={user?.userEmail || user?.email || ""}
            readOnly
            disabled
          />

          <Input
            label="Número telefónico"
            value={user?.userPhone || user?.phone || ""}
            readOnly
            disabled
          />

          <Input
            label="Dirección residencial"
            value={user?.userAddress || user?.address || ""}
            readOnly
            disabled
          />

          <Input
            label="Fecha inicio laboral"
            value={user?.userStartDate || user?.startDate || "No registrada"}
            readOnly
            disabled
          />

          <Input
            label="Fecha fin laboral"
            value={user?.userEndDate || user?.endDate || "Sin fecha de fin"}
            readOnly
            disabled
          />
        </div>

        {/* Columna 3: Perfil, Teléfono Secundario y Estado */}
        <div className="flex flex-col justify-between gap-6 p-5 rounded-2xl bg-[var(--color-surface-dark)] border border-[var(--color-border)]/40">
          <div className="flex flex-col items-center gap-4">
            <div className="w-full flex items-center gap-2 pb-2 border-b border-[var(--color-border)]/30">
              <ImageIcon className="w-5 h-5 text-[var(--color-brand)]" />
              <h2 className="text-base font-bold font-[var(--font-heading)] text-[var(--color-text-inverse)]">
                Perfil y Estado
              </h2>
            </div>

            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt={user?.userName || "Foto de usuario"}
                className="w-36 h-36 sm:w-40 sm:h-40 object-cover rounded-2xl border-2 border-[var(--color-brand)] shadow-lg mt-2"
              />
            ) : (
              <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-2xl bg-[var(--color-brand)] text-[var(--color-text-primary)] flex items-center justify-center text-4xl font-bold font-[var(--font-heading)] shadow-lg border-2 border-[var(--color-brand-hover)] mt-2">
                {initials}
              </div>
            )}

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-background-inverse)] border border-[var(--color-border)]/20">
              <span className="text-xs text-[var(--color-text-muted)] font-[var(--font-label)]">
                Estado del usuario:
              </span>
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isActivo ? "bg-[var(--color-success)]" : "bg-[var(--color-error)]"
                }`}
              />
              <span className="text-xs font-semibold text-[var(--color-text-inverse)]">
                {isActivo ? "Activo" : "Inactivo"}
              </span>
            </div>

            <div className="w-full pt-1">
              <span className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5">
                Teléfono secundario
              </span>
              <div className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-background-inverse)] border border-[var(--color-brand)]/35 text-[var(--color-text-inverse)] text-sm font-medium flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-[var(--color-brand)] shrink-0" />
                <span>
                  {user?.userSecondaryPhone || "Sin teléfono secundario"}
                </span>
              </div>
            </div>
          </div>

          {user?.id && (
            <div className="w-full pt-4 border-t border-[var(--color-border)]/30">
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={() => navigate(`/dashboard/userEdit/${user.id}`)}
                className="w-full"
              >
                <Pencil className="w-4 h-4" />
                Editar este usuario
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}