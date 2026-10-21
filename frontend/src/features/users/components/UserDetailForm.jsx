import userProfile from "@/assets/images/user-profile.png";
import Input from "@/shared/components/Input";

export default function UserDetailForm({ user }) {
  return (
    <div className="bg-[var(--color-background-inverse)] text-[var(--color-text-inverse)] rounded-3xl p-6 sm:p-10 w-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-center border border-[var(--color-brand)]">
      
      {/* Título */}
      <div className="lg:col-span-3 flex items-center gap-3">
        <h1 className="text-[var(--text-display)] font-[var(--font-heading)]">
          Visualizar usuarios
        </h1>
      </div>

      {/* Imagen y estado */}
      <div className="flex flex-col items-center justify-center gap-4 lg:order-last">
        <img
          src={userProfile}
          alt={user?.fullName || "Foto de usuario"}
          className="w-36 h-36 sm:w-48 sm:h-48 object-cover rounded-xl border-4 border-[var(--color-brand-hover)]"
        />

        <div className="flex items-center gap-2">
          <span className="text-[var(--text-small)] font-[var(--font-label)]">
            Estado del usuario:
          </span>
          <span
            className={`w-3 h-3 rounded-full ${
              user?.active
                ? "bg-[var(--color-success)]"
                : "bg-[var(--color-error)]"
            }`}
          />
        </div>
      </div>

      
      <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Tipo de documento"
          value={user?.documentType || ""}
          readOnly
        />

        <Input
          label="Correo electrónico"
          value={user?.email || ""}
          readOnly
        />

        <Input
          label="Número de documento"
          value={user?.documentNumber || ""}
          readOnly
        />

        <Input
          label="Número telefónico"
          value={user?.phone || ""}
          readOnly
        />

        <Input
          label="Nombre completo"
          value={user?.fullName || ""}
          readOnly
        />

        <Input
          label="Dirección residencial"
          value={user?.address || ""}
          readOnly
        />

        <Input
          label="Tipo de usuario"
          value={user?.userType || ""}
          readOnly
        />

        <Input
          label="Fecha inicio laboral"
          value={user?.startDate || ""}
          readOnly
        />

        <Input
          label="Fecha fin laboral"
          value={user?.endDate || ""}
          readOnly
        />
      </div>

    </div>
  );
}