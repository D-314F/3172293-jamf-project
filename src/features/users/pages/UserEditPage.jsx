import { useState } from "react";
import UserEditContent from "../components/UserEditContent";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared";
import { ArrowLeft } from "lucide-react";

export default function UserEditPage({ user = {} }) {
  const navigate = useNavigate();

  // Estado del formulario con datos de prueba
  const [formData, setFormData] = useState({
    userName: user.fullName || "Maycol James Guzman Velásquez",
    userEmail: user.email || "maycoljamesguzmanvelasquez@gmail.com",
    userPhone: user.phone || "3147801819",
    userBusinessEmail: user.businessEmail || "maycoljamesguzmanvelasquez@gmail.com",
    userAddress: user.address || "Calle 27 #24-51",
    userStartDate: user.startDate || "28/07/2025",
    userEndDate: user.endDate || "28/07/2026",
    userDocumentTypes: user.documentType || "Cédula de ciudadanía",
    userType: user.userType || "Administrador",
    userDocumentNumber: user.documentNumber || "1030405816",
    isActive: user.active ?? true,
  });

  // Función que simula el guardado de datos
  // En UserEditPage.jsx
const handleSubmit = (e) => {
  // Verificamos que 'e' exista y tenga la función preventDefault antes de llamarla
  if (e && typeof e.preventDefault === "function") {
    e.preventDefault();
  }

  // 1. Mensaje de confirmación
  alert("¡Cambios aplicados con éxito!");

  // 2. Redirección a la lista de usuarios
  navigate(-1);
};

  return (
    <section className="p-4 sm:p-8 space-y-6">
      {/* Botón Volver */}
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

      {/* Componente del Formulario pasándole el handler */}
      <UserEditContent
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
      />
    </section>
  );
}