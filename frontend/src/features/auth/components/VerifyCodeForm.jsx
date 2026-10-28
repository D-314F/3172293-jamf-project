// src/features/auth/components/VerifyCodeForm.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Input, Button } from "@/shared";
import { verifyCodeSchema } from "../schemas/verifyCodeSchema";
import { 
  showSuccessAlert, 
  showUserErrorAlert 
} from "@/shared/services/alertService";

import bf1 from "@/assets/images/bf-1.png";

export default function VerifyCodeForm() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    code: "",
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
    const result = verifyCodeSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
      });
      setErrors(fieldErrors);

      await showUserErrorAlert({
        title: "Código inválido",
        text: "Por favor, ingresa un código de verificación válido.",
      });

      return;
    }

    setErrors({});

    try {
      await showSuccessAlert({
        title: "Código verificado",
        text: "El código es correcto. Ahora puedes restablecer tu contraseña.",
        timer: 2000,
      });

      navigate("/reset-password");

    } catch (error) {
      console.error("Error al verificar el código", error);

      await showUserErrorAlert({
        title: "Error de verificación",
        text: "El código ingresado es incorrecto o ha expirado.",
      });
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden">
      {/* Fondo y overlay idénticos a los demás formularios */}
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
              Verificar Código
            </h1>

            <p className="text-[var(--color-text-muted)] text-xs sm:text-sm text-center">
              Ingresa el código que enviamos a tu correo
            </p>
          </div>

          <Input
            label="Código de verificación"
            name="code"
            type="text"
            value={formData.code}
            placeholder="Escribe el código"
            onChange={handleChange}
            error={errors.code}
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full mt-2"
          >
            Verificar
          </Button>
        </form>
      </div>
    </div>
  );
}
