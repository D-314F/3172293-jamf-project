import { useState, useEffect } from "react";
import StatusSwitch from "@/shared/components/StatusSwitch";
import ProviderRowActions from "../components/ProviderRowActions";
import { updateProvider } from "../services/providerServices";
import { getProviderProductLabel } from "../data/providersValue";

export function formatProviderDocumentType(rawValue) {
  const normalized = String(rawValue || "nit")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (normalized === "nit" || normalized.includes("tributaria")) {
    return { short: "NIT", label: "NIT Tributario" };
  }
  if (normalized === "cc" || normalized.includes("ciudadania")) {
    return { short: "CC", label: "Cédula de ciudadanía" };
  }
  if (normalized === "ce" || normalized.includes("extranjeria")) {
    return { short: "CE", label: "Cédula de extranjería" };
  }
  if (normalized === "ti" || normalized.includes("identidad")) {
    return { short: "TI", label: "Tarjeta de identidad" };
  }
  if (normalized.includes("proteccion") || normalized === "ppt") {
    return { short: "PPT", label: "Permiso Protección Temporal" };
  }
  if (normalized.includes("permiso") || normalized === "pep") {
    return { short: "PEP", label: "Permiso Especial (PEP)" };
  }
  if (normalized.includes("pasaporte") || normalized === "pas") {
    return { short: "PAS", label: "Pasaporte" };
  }

  return {
    short: normalized.slice(0, 3).toUpperCase() || "NIT",
    label: rawValue || "NIT Tributario",
  };
}

function ProviderStatusCell({ provider, canEdit = true }) {
  const realStatus = Boolean(provider.isActive ?? provider.providerStatus);
  const [checked, setChecked] = useState(realStatus);

  useEffect(() => {
    setChecked(Boolean(provider.isActive ?? provider.providerStatus));
  }, [provider.id, provider.isActive, provider.providerStatus]);

  const handleChange = async (value) => {
    await updateProvider(provider.id, { isActive: value });
    provider.isActive = value;
    provider.providerStatus = value;
    setChecked(value);

    window.dispatchEvent(
      new CustomEvent("jamf:provider-status-updated", {
        detail: { id: provider.id, isActive: value },
      })
    );
  };

  return (
    <StatusSwitch
      checked={checked}
      disabled={!canEdit}
      onChange={handleChange}
      itemName={`al proveedor "${provider.fullName}"`}
    />
  );
}

export const getProviderColumns = ({
  canView = true,
  canEdit = true,
} = {}) => [
  {
    accessorKey: "fullName",
    header: "Nombre / Razón social",
    cell: ({ row }) => (
      <span className="font-medium text-[var(--color-text-inverse)]">
        {row.original.fullName}
      </span>
    ),
  },
  {
    accessorKey: "providerDocumentNumber",
    header: "Documento",
    cell: ({ row }) => {
      const { short } = formatProviderDocumentType(row.original.documentType);
      const number = row.original.providerDocumentNumber || "Sin registrar";

      return (
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-[var(--color-brand)]/15 text-[var(--color-brand)] border border-[var(--color-brand)]/30">
            {short}
          </span>
          <span>{number}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "products",
    header: "Suministro",
    cell: ({ row }) => (
      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--color-surface-hover)] text-[var(--color-text-inverse)] border border-[var(--color-border)]">
        {getProviderProductLabel(
          row.original.providerProducts || row.original.products
        )}
      </span>
    ),
  },
  {
    accessorKey: "email",
    header: "Correo electrónico",
  },
  {
    accessorKey: "phone",
    header: "Teléfono",
  },
  {
    accessorKey: "isActive",
    header: "Estado",
    cell: ({ row }) => (
      <ProviderStatusCell
        key={`provider-status-${row.original.id}`}
        provider={row.original}
        canEdit={canEdit}
      />
    ),
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => (
      <ProviderRowActions
        provider={row.original}
        canView={canView}
        canEdit={canEdit}
      />
    ),
  },
];

export const providerColumns = getProviderColumns();
