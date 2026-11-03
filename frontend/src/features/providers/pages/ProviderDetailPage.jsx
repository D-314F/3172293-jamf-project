import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProviderDetailForm from "../components/ProviderDetailForm";
import { Button } from "@/shared";
import { ArrowLeft } from "lucide-react";
import { getProviderById } from "../services/providerServices";

export default function ProviderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProvider = async () => {
      try {
        const data = await getProviderById(id);
        setProvider(data);
      } catch (error) {
        console.error("Error al cargar proveedor:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProvider();
  }, [id]);

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-20 md:pt-28 pb-10 flex flex-col gap-4">
      <div className="flex justify-start">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => navigate(-1)}
          className="!w-auto flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Atrás
        </Button>
      </div>

      {loading ? (
        <div className="p-8 text-center text-[var(--color-text-inverse)]">
          Cargando datos del proveedor...
        </div>
      ) : (
        <ProviderDetailForm provider={provider || {}} />
      )}
    </section>
  );
}