import userProfile from "@/assets/images/user-profile.png";
import { Input, Checkbox } from "@/shared";

export default function UserDetailForm({ user }) {
  const isActive = Boolean(user?.isActive ?? user?.active);

  return (
    <div className="bg-[var(--color-background-inverse)] text-[var(--color-text-inverse)] rounded-3xl p-6 sm:p-10 w-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-center border border-[var(--color-brand)]">
      {/* Título */}
      <div className="lg:col-span-3 flex items-center gap-3">
        <h1 className="text-[var(--text-display)] font-[var(--font-heading)]">
          Visualizar usuario
        </h1>
      </div>

      {/* Imagen y estado con Checkbox */}
      <div className="flex flex-col items-center justify-center gap-4 lg:order-last">
        <img
          src={user?.userAvatarUrl || userProfile}
          alt={user?.userName || "Foto de usuario"}
          className="w-36 h-36 sm:w-48 sm:h-48 object-cover rounded-xl border-4 border-[var(--color-brand-hover)]"
        />

        <div className="flex items-center justify-center pt-1">
          <Checkbox
            id="userActiveView"
            name="userActiveView"
            label={
              isActive
                ? "Estado del usuario (Activo)"
                : "Estado del usuario (Inactivo)"
            }
            checked={isActive}
            disabled
          />
        </div>
      </div>

      <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Tipo de documento"
          value={user?.userDocumentTypes || user?.documentType || ""}
          readOnly
        />

        <Input
          label="Correo electrónico"
          value={user?.userEmail || user?.email || ""}
          readOnly
        />

        <Input
          label="Número de documento"
          value={user?.userDocumentNumber || user?.documentNumber || ""}
          readOnly
        />

        <Input
          label="Número telefónico"
          value={user?.userPhone || user?.phone || ""}
          readOnly
        />

        <Input
          label="Nombre completo"
          value={user?.userName || user?.fullName || ""}
          readOnly
        />

        <Input
          label="Dirección residencial"
          value={user?.userAddress || user?.address || ""}
          readOnly
        />

        <Input
          label="Tipo de usuario"
          value={user?.userType || ""}
          readOnly
        />

        <Input
          label="Fecha inicio laboral"
          value={user?.userStartDate || user?.startDate || ""}
          readOnly
        />

        <Input
          label="Fecha fin laboral"
          value={user?.userEndDate || user?.endDate || "Sin fecha de fin"}
          readOnly
        />
      </div>
    </div>
  );
}