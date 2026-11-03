import providerLogo from "@/assets/images/provider-logo.png";
import { Input } from "@/shared";

export default function ProviderDetailForm({ provider }) {
  const isActivo = Boolean(provider?.providerStatus ?? provider?.active ?? true);

  return (
    <div className="bg-[var(--color-background-inverse)] text-[var(--color-text-inverse)] rounded-3xl p-6 sm:p-10 w-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-center border border-[var(--color-brand)]">
      
      {/* Título de la tarjeta */}
      <div className="lg:col-span-3 flex items-center gap-3">
        <h1 className="text-xl sm:text-2xl font-bold font-[var(--font-heading)] text-[var(--color-text-inverse)]">
          Visualizar proveedor
        </h1>
      </div>

      <div className="flex flex-col items-center justify-center gap-4 lg:order-last">
        <img
          src={provider?.providerImageUrl || providerLogo}
          alt={provider?.providerName || provider?.fullName || "Logo del proveedor"}
          className="w-36 h-36 sm:w-48 sm:h-48 object-cover rounded-xl border-4 border-[var(--color-brand-hover)] shadow-lg"
        />

        <div className="flex items-center gap-2">
          <span className="text-sm font-[var(--font-label)]">
            Estado del proveedor:
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

      <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Nombre o Razón Social"
          value={provider?.providerName || provider?.fullName || ""}
          readOnly
          disabled
        />

        <Input
          label="Tipo de Documento"
          value={provider?.providerDocumentType || provider?.documentType || ""}
          readOnly
          disabled
        />

        <Input
          label="Número de Documento"
          value={provider?.providerDocumentNumber || ""}
          readOnly
          disabled
        />

        <Input
          label="Correo de Contacto"
          value={provider?.providerEmail || provider?.email || ""}
          readOnly
          disabled
        />

        <Input
          label="Teléfono"
          value={provider?.providerPhone || provider?.phone || ""}
          readOnly
          disabled
        />

        <Input
          label="Dirección"
          value={provider?.providerAddress || provider?.address || ""}
          readOnly
          disabled
        />

        <Input
          label="Productos que Suministra"
          value={provider?.providerProducts || provider?.products || ""}
          readOnly
          disabled
        />

        <Input
          label="Observaciones"
          value={provider?.providerObservations || provider?.observations || "Sin observaciones"}
          readOnly
          disabled
        />
      </div>

    </div>
  );
}