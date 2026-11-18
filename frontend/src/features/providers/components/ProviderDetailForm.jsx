import { Input, resolveMediaUrl } from "@/shared";
import {
  getProviderDocLabel,
  getProviderProductLabel,
} from "../data/providersValue";

function getInitials(name = "") {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "PR";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export default function ProviderDetailForm({ provider }) {
  const isActivo = Boolean(
    provider?.providerStatus ?? provider?.isActive ?? true
  );
  const displayName = provider?.providerName || provider?.fullName || "";
  const docTypeLabel = getProviderDocLabel(
    provider?.providerDocumentType || provider?.documentType
  );
  const productLabel = getProviderProductLabel(
    provider?.providerProducts || provider?.products
  );

  return (
    <div className="bg-[var(--color-background-inverse)] text-[var(--color-text-inverse)] rounded-3xl p-6 sm:p-10 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start border border-[var(--color-brand)]/60 shadow-2xl">
      {/* Encabezado */}
      <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col gap-1 border-b border-[var(--color-border)] pb-4">
        <h1 className="text-xl sm:text-2xl font-bold font-[var(--font-heading)] text-[var(--color-text-inverse)]">
          Visualizar Proveedor
        </h1>
        <p className="text-small text-[var(--color-text-muted)]">
          Ficha técnica de solo lectura del aliado comercial y abastecimiento
        </p>
      </div>

      {/* Columna 1: Identificación tributaria y Razón social */}
      <div className="flex flex-col gap-4 bg-[var(--color-surface-dark)]/50 p-5 rounded-2xl border border-[var(--color-border)]/60">
        <Input
          label="Tipo de documento"
          value={docTypeLabel}
          readOnly
          disabled
        />

        <Input
          label="Número de documento / NIT"
          value={provider?.providerDocumentNumber || "Sin registrar"}
          readOnly
          disabled
        />

        <Input
          label="Nombre o Razón Social"
          value={displayName}
          readOnly
          disabled
        />

        <Input
          label="Productos que suministra"
          value={productLabel}
          readOnly
          disabled
        />
      </div>

      {/* Columna 2: Contacto, Dirección y Observaciones */}
      <div className="flex flex-col gap-4 bg-[var(--color-surface-dark)]/50 p-5 rounded-2xl border border-[var(--color-border)]/60">
        <Input
          label="Correo electrónico empresarial"
          value={provider?.providerEmail || provider?.email || ""}
          readOnly
          disabled
        />

        <Input
          label="Número telefónico"
          value={provider?.providerPhone || provider?.phone || ""}
          readOnly
          disabled
        />

        <Input
          label="Dirección comercial / Bodega"
          value={provider?.providerAddress || provider?.address || ""}
          readOnly
          disabled
        />

        <Input
          label="Observaciones de entrega"
          value={
            provider?.providerObservations ||
            provider?.observations ||
            "Sin observaciones registradas"
          }
          readOnly
          disabled
        />
      </div>

      {/* Columna 3: Logo / Iniciales y Estado */}
      <div className="flex flex-col items-center justify-center gap-5 bg-[var(--color-surface-dark)]/50 p-6 rounded-2xl border border-[var(--color-border)]/60 w-full h-full">
        {provider?.providerImageUrl ? (
          <img
            src={resolveMediaUrl(provider.providerImageUrl)}
            alt={displayName || "Logo del proveedor"}
            className="w-36 h-36 sm:w-44 sm:h-44 object-cover rounded-2xl border-2 border-[var(--color-brand)] shadow-lg"
          />
        ) : (
          <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl border-2 border-[var(--color-brand)] bg-[var(--color-brand)]/15 flex flex-col items-center justify-center shadow-lg">
            <span className="text-4xl font-bold font-[var(--font-heading)] text-[var(--color-brand)]">
              {getInitials(displayName)}
            </span>
            <span className="text-xs text-[var(--color-text-muted)] mt-1.5">
              Aliado JAMF
            </span>
          </div>
        )}

        <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-[var(--color-background-inverse)] border border-[var(--color-border)]">
          <span className="text-sm font-[var(--font-label)] text-[var(--color-text-muted)]">
            Estado del proveedor:
          </span>
          <span
            className={`w-3 h-3 rounded-full ${
              isActivo ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="text-sm font-semibold text-[var(--color-text-inverse)]">
            {isActivo ? "Activo" : "Inactivo"}
          </span>
        </div>
      </div>
    </div>
  );
}