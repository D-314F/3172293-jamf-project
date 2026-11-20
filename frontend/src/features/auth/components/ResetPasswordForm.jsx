// src/features/auth/components/ResetPasswordForm.jsx
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ArrowLeft, KeyRound, ShieldAlert } from "lucide-react";
import { Input, Button } from "@/shared";
import { resetPasswordSchema } from "../schemas/resetPasswordSchema";
import {
  showSuccessAlert,
  showUserErrorAlert,
} from "@/shared/services/alertService";

import bf1 from "@/assets/images/bf-1.png";
import logo from "@/assets/images/1-logo.png";

export default function ResetPasswordForm() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

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
    const result = resetPasswordSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
      });
      setErrors(fieldErrors);

      await showUserErrorAlert({
        title: "Campos inválidos",
        text: "Verifica que la contraseña cumpla los requisitos de seguridad y coincida.",
      });

      return;
    }

    setErrors({});

    try {
      sessionStorage.removeItem("recoveryEmail");
      sessionStorage.removeItem("recoveryPin");

      await showSuccessAlert({
        title: "Contraseña actualizada",
        text: "Tu contraseña ha sido restablecida correctamente. Redirigiendo...",
        timer: 2000,
      });

      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Error al restablecer la contraseña", error);

      await showUserErrorAlert({
        title: "Error al guardar",
        text: "No se pudo actualizar la contraseña. Por favor, intenta de nuevo.",
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
            onClick={() => navigate("/verify-code")}
            className="!w-auto min-h-[48px] flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Atrás
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
              Restablecer Contraseña
            </h1>
            <p className="text-[var(--color-text-muted)] text-medium max-w-xs mx-auto">
              Define tu nueva contraseña segura para acceder a la plataforma
            </p>
          </div>

          <div className="w-full flex items-start gap-2 rounded-2xl bg-[var(--color-surface-dark)] border border-[var(--color-brand)]/25 px-3.5 py-2.5 text-small text-[var(--color-text-muted)]">
            <ShieldAlert className="w-4 h-4 text-[var(--color-brand)] shrink-0 mt-0.5" />
            <span>
              Mínimo 10 caracteres, incluyendo mayúscula, minúscula, número y
              símbolo (ej. <strong className="text-[var(--color-text-inverse)]">Jamf2026*!</strong>).
            </span>
          </div>

          <div className="w-full flex flex-col gap-4">
            <Input
              label="Nueva contraseña"
              htmlFor="reset-password"
              name="password"
              type="password"
              value={formData.password}
              placeholder="••••••••••"
              onChange={handleChange}
              error={errors.password}
            />

            <Input
              label="Confirmar contraseña"
              htmlFor="reset-confirm-password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              placeholder="••••••••••"
              onChange={handleChange}
              error={errors.confirmPassword}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full min-h-[48px] mt-1 flex items-center justify-center gap-2"
          >
            <KeyRound className="w-4 h-4" />
            Guardar nueva contraseña
          </Button>
        </form>
      </div>
    </div>
  );
}