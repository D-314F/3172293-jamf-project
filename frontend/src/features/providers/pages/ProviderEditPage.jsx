import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProviderEditContent from "../components/ProviderEditContent";
import { getProviderById, updateProvider } from "../services/providerServices";

export default function ProviderEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProvider = async () => {
      try {
        const data = await getProviderById(id);
        setFormData({
          providerDocumentType: data.providerDocumentType || "",
          providerDocumentNumber: data.providerDocumentNumber || "",
          providerName: data.providerName || data.fullName || "",
          providerEmail: data.providerEmail || data.email || "",
          providerPhone: data.providerPhone || data.phone || "",
          providerAddress: data.providerAddress || data.address || "",
          providerProducts: data.providerProducts || data.products || "",
          providerObservations: data.providerObservations || data.observations || "",
          providerImage: [],
          providerStatus: data.providerStatus ?? true,
        });
      } catch (error) {
        console.error("Error al cargar datos del proveedor:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProvider();
  }, [id]);

  const handleSubmit = async (dataToSend) => {
    await updateProvider(id, dataToSend);
  };

  return (
    <section className="w-full">
      {loading ? (
        <div className="p-8 text-center text-[var(--color-text-inverse)]">
          Cargando datos del proveedor...
        </div>
      ) : (
        <ProviderEditContent
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
        />
      )}
    </section>
  );
}