import providerLogo from "@/assets/images/provider-logo.png";

export default function ProviderDetailForm({ provider }) {
  return (
    <div className="bg-[var(--color-background-inverse)] text-[var(--color-text-inverse)] rounded-3xl p-10 max-w-6xl mx-auto grid grid-cols-3 gap-8 items-center border border-[var(--color-brand-hover)]">
      {/* 🧩 Título */}
      <div className="col-span-3 flex items-center gap-3 mb-4">
        <span className="text-[var(--text-display)] font-[var(--font-heading)]">
          Visualizar proveedores
        </span>
      </div>

      {/* 🧾 Datos del proveedor */}
      <div className="col-span-2 grid grid-cols-2 gap-6">
        <div>
          <label className="block text-[var(--text-small)] font-[var(--font-label)] mb-1">
            Nombre de la empresa
          </label>
          <input
            type="text"
            value={provider.companyName}
            readOnly
            className="w-full bg-transparent border border-[var(--color-border)] rounded-md px-3 py-2 text-[var(--color-text-muted)]"
          />
        </div>

        <div>
          <label className="block text-[var(--text-small)] font-[var(--font-label)] mb-1">
            NIT
          </label>
          <input
            type="text"
            value={provider.nit}
            readOnly
            className="w-full bg-transparent border border-[var(--color-border)] rounded-md px-3 py-2 text-[var(--color-text-muted)]"
          />
        </div>

        <div>
          <label className="block text-[var(--text-small)] font-[var(--font-label)] mb-1">
            Correo de contacto
          </label>
          <input
            type="text"
            value={provider.email}
            readOnly
            className="w-full bg-transparent border border-[var(--color-border)] rounded-md px-3 py-2 text-[var(--color-text-muted)]"
          />
        </div>

        <div>
          <label className="block text-[var(--text-small)] font-[var(--font-label)] mb-1">
            Teléfono
          </label>
          <input
            type="text"
            value={provider.phone}
            readOnly
            className="w-full bg-transparent border border-[var(--color-border)] rounded-md px-3 py-2 text-[var(--color-text-muted)]"
          />
        </div>

        <div>
          <label className="block text-[var(--text-small)] font-[var(--font-label)] mb-1">
            Dirección
          </label>
          <input
            type="text"
            value={provider.address}
            readOnly
            className="w-full bg-transparent border border-[var(--color-border)] rounded-md px-3 py-2 text-[var(--color-text-muted)]"
          />
        </div>

        <div>
          <label className="block text-[var(--text-small)] font-[var(--font-label)] mb-1">
            Fecha inicio relación
          </label>
          <input
            type="text"
            value={provider.startDate}
            readOnly
            className="w-full bg-transparent border border-[var(--color-border)] rounded-md px-3 py-2 text-[var(--color-text-muted)]"
          />
        </div>

        <div>
          <label className="block text-[var(--text-small)] font-[var(--font-label)] mb-1">
            Fecha fin relación
          </label>
          <input
            type="text"
            value={provider.endDate}
            readOnly
            className="w-full bg-transparent border border-[var(--color-border)] rounded-md px-3 py-2 text-[var(--color-text-muted)]"
          />
        </div>
      </div>

      {/* Imagen y estado */}
      <div className="flex flex-col items-center justify-center gap-4">
        <img
          src={providerLogo}
          alt={provider.companyName}
          className="w-48 h-48 object-cover rounded-xl border-4 border-[var(--color-brand)]"
        />

        <div className="flex items-center gap-2">
          <span className="text-[var(--text-small)]">Estado del proveedor:</span>
          <span
            className={`w-3 h-3 rounded-full ${
              provider.active
                ? "bg-[var(--color-success)]"
                : "bg-[var(--color-error)]"
            }`}
          ></span>
        </div>
      </div>
    </div>
  );
}
