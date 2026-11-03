import userProfile from "@/assets/images/user-profile.png";
import { Input } from "@/shared";

export default function UserDetailForm({ user }) {
  const isActivo = Boolean(user?.isActive ?? user?.active ?? user?.is_active ?? true);

  return (
    <div className="bg-[var(--color-background-inverse)] text-[var(--color-text-inverse)] rounded-3xl p-6 sm:p-10 w-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-center border border-[var(--color-brand)] shadow-2xl">
      {/* Título */}
      <div className="lg:col-span-3 flex items-center gap-3">
        <h1 className="text-xl sm:text-2xl font-bold font-[var(--font-heading)] text-[var(--color-text-inverse)]">
          Visualizar usuario
        </h1>
      </div>

      {/* Imagen e Indicador de Estado (Estilo Proveedores) */}
      <div className="flex flex-col items-center justify-center gap-4 lg:order-last">
        <img
          src={user?.userAvatarUrl || userProfile}
          alt={user?.userName || "Foto de usuario"}
          className="w-36 h-36 sm:w-48 sm:h-48 object-cover rounded-xl border-4 border-[var(--color-brand-hover)] shadow-lg"
        />

        <div className="flex items-center gap-2">
          <span className="text-sm font-[var(--font-label)]">
            Estado del usuario:
          </span>
          <span
            className={`w-3 h-3 rounded-full ${
              isActivo ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="text-xs font-semibold">
            {isActivo ? "Activo" : "Inactivo"}
          </span>
        </div>
      </div>

      {/* Datos del usuario */}
      <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Tipo de documento"
          value={user?.userDocumentTypes || user?.documentType || ""}
          readOnly
          disabled
        />

        <Input
          label="Correo electrónico"
          value={user?.userEmail || user?.email || ""}
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
          label="Número telefónico"
          value={user?.userPhone || user?.phone || ""}
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
          label="Dirección residencial"
          value={user?.userAddress || user?.address || ""}
          readOnly
          disabled
        />

        <Input
          label="Tipo de usuario"
          value={user?.userType || ""}
          readOnly
          disabled
        />

        <Input
          label="Fecha inicio laboral"
          value={user?.userStartDate || user?.startDate || ""}
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
    </div>
  );
}