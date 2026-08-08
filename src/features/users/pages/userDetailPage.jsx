import UserDetailForm from "../components/UserDetailForm";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared";
import { ArrowLeft } from "lucide-react";

export default function UserDetailPage() {
  const navigate = useNavigate();

  const user = {
    documentType: "Cédula de ciudadanía",
    documentNumber: "1030405816",
    fullName: "Maycol James Guzman Velásquez",
    userType: "Administrador",
    email: "maycoljamesguzmanvelasquez@gmail.com",
    phone: "+57 314 7801819",
    address: "Calle 27 #24-51",
    startDate: "28/07/2025",
    endDate: "28/07/2026",
    image: "assets/images/user-profile.png",
    active: true,
  };

  return (
    <section className="p-4 sm:p-8 space-y-6">
      {/* Botón de retroceso usando la variante del componente */}
      <div className="w-fit mb-6">
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Atrás
        </Button>
      </div>

      {/* Detalle del usuario */}
      <UserDetailForm user={user} />
    </section>
  );
}