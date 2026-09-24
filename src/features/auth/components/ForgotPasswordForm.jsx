import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
      console.log("Errores de Zod:", result.error.issues);
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
      });
      setErrors(fieldErrors);

      // ALERTA DE ERROR POR CAMPO INVÁLIDO
      await showUserErrorAlert({
        title: "Correo inválido",
        text: "Por favor, ingresa un correo electrónico válido.",
      });

      return;
    }

    setErrors({});

    try {
      // Petición al backend si aplica:
      // await sendPasswordResetEmail(formData.email);

      // ALERTA DE ÉXITO ESTANDARIZADA
      await showSuccessAlert({
        title: "Código enviado",
        text: "Se ha enviado el código de recuperación correctamente a tu correo.",
        timer: 2000,
      });

      // Redirección a verificación de código
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
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${bf1})` }}
    >
      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-black/50 z-0"></div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 bg-[var(--color-background-inverse)] border border-[var(--color-brand)] rounded-3xl relative z-10 shadow-2xl font-[var(--font-body)] flex flex-col gap-5 text-left"
      >
        <div>
          <h1 className="text-[var(--text-title)] font-[var(--font-heading)] text-[var(--color-brand)] text-center mb-2">
            Recuperar Contraseña
          </h1>

          <p className="text-[var(--color-text-secondary)] text-[var(--text-body)] text-center">
            Ingresa tu correo registrado para recibir el código de recuperación
          </p>
        </div>

        <Input
          label="Correo Electrónico"
          name="email"
          type="email"
          value={formData.email}
          placeholder="Escribe tu correo electrónico"
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
  );
}