// src/features/auth/components/ResetPasswordForm.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Input, Button } from "@/shared";
import { resetPasswordSchema } from "../schemas/resetPasswordSchema";
import { 
  showSuccessAlert, 
  showUserErrorAlert 
} from "@/shared/services/alertService";

import bf1 from "@/assets/images/bf-1.png";

export default function ResetPasswordForm() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = resetPasswordSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
      });
      setErrors(fieldErrors);

      await showUserErrorAlert({
        title: "Campos inválidos",
        text: "Por favor, verifica que la contraseña cumpla los requisitos y coincida.",
      });

      return;
    }

    setErrors({});

    try {
      await showSuccessAlert({
        title: "Contraseña actualizada",
        text: "Tu contraseña ha sido restablecida correctamente. Redirigiendo...",
        timer: 2000,
      });

      navigate("/login");

    } catch (error) {
      console.error("Error al restablecer la contraseña", error);

      await showUserErrorAlert({
        title: "Error al guardar",
        text: "No se pudo actualizar la contraseña. Por favor, intenta de nuevo.",
      });
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden">
      {/* Fondo y overlay unificados */}
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

        {/* Tarjeta del Formulario */}
        <form
          onSubmit={handleSubmit}
          className="w-full p-6 sm:p-8 md:p-10 bg-[var(--color-background-inverse)] border border-[var(--color-brand)] rounded-3xl shadow-2xl font-[var(--font-body)] flex flex-col gap-5 text-left"
        >
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-[var(--font-heading)] text-[var(--color-brand)] text-center mb-2">
              Restablecer Contraseña
            </h2>

            <p className="text-[var(--color-text-muted)] text-xs sm:text-sm text-center">
              Ingresa tu nueva contraseña y confírmala para continuar
            </p>
          </div>

          <Input
            label="Nueva contraseña"
            name="password"
            type="password"
            value={formData.password}
            placeholder="••••••••"
            onChange={handleChange}
            error={errors.password}
          />

          <Input
            label="Confirmar contraseña"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            placeholder="••••••••"
            onChange={handleChange}
            error={errors.confirmPassword}
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full mt-2"
          >
            Guardar nueva contraseña
          </Button>
        </form>
      </div>
    </div>
  );
}
