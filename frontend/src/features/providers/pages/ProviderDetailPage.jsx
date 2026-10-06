import ProviderDetailForm from "../components/ProviderDetailForm";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared";

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
    <section className="p-8 space-y-6">
      {/*Botón de retroceso */}
      <div className="w-fit mb-6">
        <Button
          variant="secondary"
          size="sm"
          type="button"
          onClick={() => navigate(-1)}
        >
          ← Atrás
        </Button>
      </div>

      {/*Detalle del proveedor */}
      <ProviderDetailForm provider={provider} />
    </section>
  );
}
