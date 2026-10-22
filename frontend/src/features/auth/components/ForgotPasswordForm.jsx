// src/features/auth/components/ForgotPasswordForm.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Input, Button } from "@/shared";
import { forgotPasswordSchema } from "../schemas/forgotPasswordSchema";
import { 
  showSuccessAlert, 
  showUserErrorAlert 
} from "@/shared/services/alertService";

import bf1 from "@/assets/images/bf-1.png";

export default function ForgotPasswordForm() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = forgotPasswordSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
      });
      setErrors(fieldErrors);

      await showUserErrorAlert({
        title: "Correo inválido",
        text: "Por favor, ingresa un correo electrónico válido.",
      });

      return;
    }

    setErrors({});

    try {
      // Aquí puedes agregar la llamada real a tu servicio de recuperación de contraseña
      await showSuccessAlert({
        title: "Código enviado",
        text: "Se ha enviado el código de recuperación correctamente a tu correo.",
        timer: 2000,
      });

      navigate("/verify-code");

    } catch (error) {
      console.error("Error al enviar código de recuperación", error);
      
      await showUserErrorAlert({
        title: "Error de envío",
        text: "No se pudo enviar el código de recuperación. Por favor intenta de nuevo.",
      });
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden">
      {/* Fondo y overlay idénticos al Login */}
      <img
        src={bf1}
        alt="Fondo de autenticación"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-0" />
      
      {/* Contenedor principal */}
      <div className="w-full max-w-md flex flex-col gap-4 relative z-10">
        
        {/* Botón Atrás */}
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

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="w-full p-6 sm:p-8 md:p-10 bg-[var(--color-background-inverse)] border border-[var(--color-brand)] rounded-3xl shadow-2xl font-[var(--font-body)] flex flex-col gap-5 text-left"
        >
          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-[var(--font-heading)] text-[var(--color-brand)] text-center mb-2">
              Recuperar Contraseña
            </h1>

            <p className="text-[var(--color-text-muted)] text-xs sm:text-sm text-center">
              Ingresa tu correo registrado para recibir el código de recuperación
            </p>
          </div>

          <Input
            label="Correo Electrónico"
            name="email"
            type="email"
            value={formData.email}
            placeholder="ejemplo@correo.com"
            onChange={handleChange}
            error={errors.email}
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full mt-2"
          >
            Enviar código de recuperación
          </Button>
        </form>
      </div>
    </div>
  );
}
