import StatusSwitch from "@/shared/components/StatusSwitch";
import { updateProvider } from "../services/providerServices";

export default function ProviderStatusCell({ provider, canEdit = true }) {
  const realStatus = Boolean(provider.isActive ?? provider.providerStatus);

  const handleChange = async (value) => {
    await updateProvider(provider.id, { isActive: value });

    window.dispatchEvent(
      new CustomEvent("jamf:provider-status-updated", {
        detail: { id: provider.id, isActive: value },
      })
    );
  };

  return (
    <StatusSwitch
      checked={realStatus}
      disabled={!canEdit}
      onChange={handleChange}
      itemName={`al proveedor "${provider.fullName}"`}
    />
  );
}
