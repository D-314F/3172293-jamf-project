import providerLogo from "@/assets/images/provider-logo.png";
import { Input } from "@/shared";

export default function ProviderDetailForm({ provider }) {
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
          src={providerLogo}
          alt={provider?.companyName || "Logo del proveedor"}
          className="w-36 h-36 sm:w-48 sm:h-48 object-cover rounded-xl border-4 border-[var(--color-brand-hover)] shadow-lg"
        />

        <div className="flex items-center gap-2">
          <span className="text-[var(--text-small)] font-[var(--font-label)]">
            Estado del proveedor:
          </span>
          <span
            className={`w-3 h-3 rounded-full ${
              provider?.active
                ? "bg-[var(--color-success)]"
                : "bg-[var(--color-error)]"
            }`}
          />
        </div>
      </div>

     
      <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Nombre de la empresa"
          value={provider?.companyName || ""}
          readOnly
        />

        <Input
          label="NIT"
          value={provider?.nit || ""}
          readOnly
        />

        <Input
          label="Correo de contacto"
          value={provider?.email || ""}
          readOnly
        />

        <Input
          label="Teléfono"
          value={provider?.phone || ""}
          readOnly
        />

        <Input
          label="Dirección"
          value={provider?.address || ""}
          readOnly
        />

        <Input
          label="Fecha inicio relación"
          value={provider?.startDate || ""}
          readOnly
        />

        <Input
          label="Fecha fin relación"
          value={provider?.endDate || ""}
          readOnly
        />
      </div>

    </div>
  );
}