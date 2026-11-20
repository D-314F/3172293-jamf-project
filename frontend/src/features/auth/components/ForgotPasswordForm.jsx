// src/features/auth/components/ForgotPasswordForm.jsx
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";
import { Input, Button } from "@/shared";
import { forgotPasswordSchema } from "../schemas/forgotPasswordSchema";
import {
  showSuccessAlert,
  showUserErrorAlert,
} from "@/shared/services/alertService";

import bf1 from "@/assets/images/bf-1.png";
import logo from "@/assets/images/1-logo.png";

export default function ForgotPasswordForm() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "",
  });

  if (sessionStorage.getItem("token")) {
    return <Navigate to="/dashboard/home" replace />;
  }

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
      sessionStorage.setItem("recoveryEmail", result.data.email.trim());

      await showSuccessAlert({
        title: "Código enviado",
        text: "Se ha enviado el código de 6 dígitos a tu correo electrónico.",
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
    <div className="h-dvh w-full flex items-center justify-center p-3 sm:p-4 relative overflow-hidden">
      <img
        src={bf1}
        alt="Fondo de autenticación"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      <div className="absolute inset-0 bg-[var(--color-background-inverse)]/70 backdrop-blur-[2px] z-0" />

      <div className="w-full max-w-md flex flex-col gap-3 relative z-10">
        <div className="flex justify-start">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => navigate("/login")}
            className="!w-auto min-h-[48px] flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al login
          </Button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full p-5 sm:p-6 bg-[var(--color-background-inverse)] border border-[var(--color-brand)] rounded-3xl shadow-2xl font-[var(--font-body)] flex flex-col items-center gap-4 text-left"
        >
          <div className="w-14 h-14 rounded-full bg-[var(--color-brand)] p-2.5 flex items-center justify-center shadow-md">
            <img
              src={logo}
              alt="Logo JAMF"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="text-center space-y-1">
            <h1 className="text-title font-[var(--font-heading)] text-[var(--color-brand)]">
              Recuperar Contraseña
            </h1>
            <p className="text-[var(--color-text-muted)] text-medium max-w-xs mx-auto">
              Ingresa tu correo registrado y te enviaremos un código PIN de 6 dígitos
            </p>
          </div>

          <div className="w-full">
            <Input
              label="Correo Electrónico"
              htmlFor="recovery-email"
              name="email"
              type="email"
              value={formData.email}
              placeholder="ejemplo@correo.com"
              onChange={handleChange}
              error={errors.email}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full min-h-[48px] mt-1 flex items-center justify-center gap-2"
          >
            <Mail className="w-4 h-4" />
            Enviar código de recuperación
          </Button>

          <div className="w-full text-center text-medium pt-3 border-t border-[var(--color-brand)]/20">
            <span className="text-[var(--color-text-inverse)]/80">
              ¿Recordaste tu contraseña?{" "}
            </span>
            <Link
              to="/login"
              className="text-[var(--color-brand)] font-[var(--font-heading)] hover:underline transition-all"
            >
              Inicia sesión
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}