import UserDetailForm from "../components/UserDetailForm";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared"; // importa tu componente Button si lo tienes

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
    <section className="p-8 space-y-6">
      {/* 🔙 Botón de retroceso */}
      <div className="w-fit mb-6">
        <Button
          variant="secondary"
          size="sm"
          type="button"
          onClick={() => navigate(-1)} // o navigate("/dashboard/userList")
        >
          ← Atrás
        </Button>
      </div>

      {/* 🧾 Detalle del usuario */}
      <UserDetailForm user={user} />
    </section>
  );
}
