// src/features/auth/components/LoginForm.jsx

import { useState, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Input, Button } from "@/shared";
import { loginSchema } from "../schemas/loginSchema";
import {
  showSuccessAlert,
  //,
  showInfoAlert,
} from "@/shared/services/alertService";
import { SUPPORT_EMAIL } from "@/features/config";

import bf1 from "@/assets/images/bf-1.png";
import logo from "@/assets/images/1-logo.png";

import { login } from "@/features/auth/services/authService";

const AUTH_CONFIG = {
  maxAttempts: 3,
  lockDurationSeconds: 600,
  successTimerMs: 2000,
  dashboardRoute: "/dashboard/home",
  sessionTokenKey: "token",
};

const AUTH_MESSAGES = {
  supportTitle: "Soporte técnico",
  supportPrefix: "Este es el correo del soporte:",
  lockedTitle: "Cuenta bloqueada",
  lockedDetail: `Cuenta bloqueada después de ${AUTH_CONFIG.maxAttempts} intentos de autenticación erróneos consecutivos.`,
  invalidFieldsTitle: "Campos inválidos",
  invalidFieldsText: "Por favor, completa correctamente todos los campos obligatorios.",
  successTitle: "¡Bienvenido!",
  successText: "Has ingresado correctamente a la plataforma.",
  invalidCredentialsTitle: "Error de autenticación",
  loginErrorTitle: "Error al iniciar sesión",
  loginFallbackError: "No fue posible iniciar sesión. Intenta nuevamente.",
};

export default function LoginForm() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const [formData, setFormData] = useState({
    userEmail: "",
    userPassword: "",
  });

  // Temporizador para desbloqueo automático
  useEffect(() => {
    let timer = null;
    if (isLocked && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsLocked(false);
            setFailedAttempts(0);
            setFeedback(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isLocked, countdown]);

  if (sessionStorage.getItem(AUTH_CONFIG.sessionTokenKey)) {
    return <Navigate to={AUTH_CONFIG.dashboardRoute} replace />;
  }

  // Formato mm:ss (ej: 10:00, 09:59...)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleSupportClick = () => {
    showInfoAlert({
      title: AUTH_MESSAGES.supportTitle,
      text: `${AUTH_MESSAGES.supportPrefix} ${SUPPORT_EMAIL}`,
    });
  };

  const handleChange = (e) => {
    if (isLocked) return;

    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (feedback) {
      setFeedback(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLocked) {
      const lockMessage = `La cuenta se encuentra bloqueada por seguridad. Podrás intentar de nuevo en ${formatTime(countdown)}.`;
      setFeedback({ type: "error", message: lockMessage });
      await ({
        title: AUTH_MESSAGES.lockedTitle,
        text: lockMessage,
      });
      return;
    }

    const result = loginSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
      });
      setErrors(fieldErrors);
      setFeedback({
        type: "error",
        message: AUTH_MESSAGES.invalidFieldsText,
      });

      await ({
        title: AUTH_MESSAGES.invalidFieldsTitle,
        text: AUTH_MESSAGES.invalidFieldsText,
      });

      return;
    }

    setErrors({});
    setFeedback(null);
    setIsSubmitting(true);

    try {
      const data = await login(result.data);

      setFailedAttempts(0);
      setIsLocked(false);
      setCountdown(0);
      sessionStorage.setItem(AUTH_CONFIG.sessionTokenKey, data.token);

      setFeedback({
        type: "success",
        message: AUTH_MESSAGES.successText,
      });

      await showSuccessAlert({
        title: AUTH_MESSAGES.successTitle,
        text: AUTH_MESSAGES.successText,
        timer: AUTH_CONFIG.successTimerMs,
      });

      navigate(AUTH_CONFIG.dashboardRoute, { replace: true });
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);

      if (error.code === "ACCOUNT_LOCKED") {
        setIsLocked(true);
        const lockSeconds = error.secondsLeft || AUTH_CONFIG.lockDurationSeconds;
        setCountdown(lockSeconds);

        const lockedText = `${AUTH_MESSAGES.lockedDetail} Podrás intentar de nuevo en ${formatTime(lockSeconds)}.`;
        setFeedback({ type: "error", message: lockedText });

        await ({
          title: AUTH_MESSAGES.lockedTitle,
          text: lockedText,
        });
      } else if (error.code === "INVALID_CREDENTIALS") {
        const nextAttempts = error.attempts ?? failedAttempts + 1;
        setFailedAttempts(nextAttempts);
        const remaining =
          error.remaining ?? Math.max(0, AUTH_CONFIG.maxAttempts - nextAttempts);

        const credentialsText = `Credenciales inválidas. Te quedan ${remaining} intento(s) antes del bloqueo.`;
        setFeedback({ type: "error", message: credentialsText });

        await ({
          title: AUTH_MESSAGES.invalidCredentialsTitle,
          text: credentialsText,
        });
      } else {
        const fallbackMessage =
          error.message || AUTH_MESSAGES.loginFallbackError;
        setFeedback({ type: "error", message: fallbackMessage });

        await ({
          title: AUTH_MESSAGES.loginErrorTitle,
          text: fallbackMessage,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormDisabled = isLocked || isSubmitting;

  return (
    <div className="h-dvh w-full flex items-center justify-center p-3 sm:p-4 relative overflow-hidden">
      {/* Fondo con overlay degradado */}
      <img
        src={bf1}
        alt="Fondo de autenticación"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      <div className="absolute inset-0 bg-[var(--color-background-inverse)]/70 backdrop-blur-[2px] z-0" />

      {/* Tarjeta de Login compacta */}
      <div className="w-full max-w-md p-5 sm:p-6 bg-[var(--color-background-inverse)] border border-[var(--color-brand)] rounded-3xl relative z-10 shadow-2xl flex flex-col items-center transition-all duration-300">
        {/* Logo */}
        <div className="w-14 h-14 mb-2 rounded-full bg-[var(--color-brand)] p-2.5 flex items-center justify-center shadow-md">
          <img
            src={logo}
            alt="Logo Marca"
            className="w-full h-full object-contain"
          />
        </div>

        <h1 className="text-title font-[var(--font-heading)] text-[var(--color-brand)] text-center mb-1">
          Iniciar Sesión
        </h1>

        <p className="text-[var(--color-text-muted)] text-medium font-[var(--font-body)] text-center mb-3 max-w-xs">
          Ingresa tus credenciales para acceder a la plataforma
        </p>

        {/* Banner de Estado Bloqueado con cuenta regresiva en vivo */}
        {isLocked && (
          <div
            role="alert"
            className="w-full mb-3 p-3 rounded-2xl bg-[var(--color-brand-soft)]/20 border border-[var(--color-brand-soft)] text-center flex flex-col items-center gap-1 shadow-lg animate-fade-in"
          >
            <span className="text-body font-[var(--font-heading)] text-[var(--color-brand-soft)]">
              {AUTH_MESSAGES.lockedTitle}
            </span>
            <span className="text-medium font-[var(--font-body)] text-[var(--color-text-inverse)]">
              {AUTH_MESSAGES.lockedDetail}
            </span>
            <span className="text-body font-[var(--font-heading)] text-[var(--color-brand)] mt-1">
              Disponible de nuevo en: {formatTime(countdown)}
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="gap-2 flex flex-col w-full">
          <Input
            label="Correo Electrónico"
            htmlFor="userEmail"
            name="userEmail"
            type="email"
            size="lg"
            labelClassName="text-xs"
            value={formData.userEmail}
            placeholder="ejemplo@correo.com"
            onChange={handleChange}
            error={errors.userEmail}
            disabled={isFormDisabled}
          />

          <Input
            label="Contraseña"
            htmlFor="userPassword"
            name="userPassword"
            type="password"
            size="lg"
            labelClassName="text-xs"
            value={formData.userPassword}
            placeholder="••••••••••"
            onChange={handleChange}
            error={errors.userPassword}
            disabled={isFormDisabled}
          />

          {/* Feedback message inline del estado de autenticación */}
          {feedback && (
            <div
              role="status"
              aria-live="polite"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-center text-medium font-[var(--font-body)] transition-all ${
                feedback.type === "success"
                  ? "bg-[var(--color-brand)]/15 border-[var(--color-brand)] text-[var(--color-text-inverse)]"
                  : "bg-[var(--color-brand-soft)]/15 border-[var(--color-brand-soft)] text-[var(--color-brand-soft)]"
              }`}
            >
              {feedback.message}
            </div>
          )}

          <div className="text-center">
            <Link
              to="/forgot-password"
              className="text-[var(--color-brand)] hover:underline transition-all font-[var(--font-label)] text-medium"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <Button
            variant={isLocked ? "secondary" : "primary"}
            size="md"
            type="submit"
            className="w-full mt-1"
            disabled={isFormDisabled}
          >
            {isLocked
              ? `Bloqueado (${formatTime(countdown)})`
              : isSubmitting
                ? "Validando..."
                : "Iniciar sesión"}
          </Button>

          {errors.submit && (
            <p className="text-[var(--color-brand-soft)] text-medium font-[var(--font-body)] text-center">
              {errors.submit}
            </p>
          )}

          <div className="text-center text-medium pt-3 border-t border-[var(--color-brand)]/20">
            <span className="text-[var(--color-text-inverse)]/80 font-[var(--font-body)]">
              ¿No tienes cuenta?{" "}
            </span>
            <Link
              to="/register"
              className="text-[var(--color-brand)] font-[var(--font-heading)] hover:underline transition-all"
            >
              Regístrate Aquí
            </Link>
          </div>
        </form>

        <div className="mt-2">
          <button
            type="button"
            onClick={handleSupportClick}
            className="text-[var(--color-text-muted)] hover:text-[var(--color-brand)] hover:underline transition-all font-[var(--font-label)] text-small cursor-pointer"
          >
            ¿Necesitas soporte?
          </button>
        </div>
      </div>
    </div>
  );
}