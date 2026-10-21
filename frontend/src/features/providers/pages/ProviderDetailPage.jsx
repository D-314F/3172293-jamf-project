import ProviderDetailForm from "../components/ProviderDetailForm";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared";
import { ArrowLeft } from "lucide-react";

export default function ProviderDetailPage() {
  const navigate = useNavigate();

  const provider = {
    companyName: "Julián Ramíros",
    nit: "900123456-7",
    email: "Julianramiroz@proveedor.com",
    phone: "+57 310 1234567",
    address: "Carrera 10 #20-30",
    startDate: "01/01/2024",
    endDate: "01/01/2025",
    active: true,
  };

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

      {/* Detalle del proveedor */}
      <ProviderDetailForm provider={provider} />
    </section>
  );
}