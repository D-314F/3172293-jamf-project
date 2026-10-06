import { useState } from "react";
import ProviderEditContent from "../components/ProviderEditContent";

export default function ProviderEditPage({ provider = {} }) {
  const [formData, setFormData] = useState({
    providerDocumentType: provider?.providerDocumentType || "",
    providerDocumentNumber: provider?.providerDocumentNumber || "",
    providerName: provider?.providerName || "",
    providerEmail: provider?.providerEmail || "",
    providerPhone: provider?.providerPhone || "",
    providerAddress: provider?.providerAddress || "",
    providerProducts: provider?.providerProducts || "",
    providerObservations: provider?.providerObservations || "",
    providerImage: provider?.providerImage || [],
    providerStatus: provider?.providerStatus ?? true,
  });

  return (
    <ProviderEditContent
      formData={formData}
      setFormData={setFormData}
      provider={provider}
    />
  );
}
