// src/features/auth/components/LoginForm.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { Input, Button } from "@/shared";
import { loginSchema } from "../schemas/loginSchema";
import { 
  showSuccessAlert, 
  showUserErrorAlert 
} from "@/shared/services/alertService";

import bf1 from "@/assets/images/bf-1.png";
import logo from "@/assets/images/1-logo.png";

import { login } from "@/features/auth/services/authService";

export default function LoginForm() {
  const navigate = useNavigate(); 
  const [errors, setErrors] = useState({});
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const [formData, setFormData] = useState({
    userEmail: "",
    userPassword: "",
  });

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Si ya está bloqueado, no permite enviar
    if (isLocked) {
      await showUserErrorAlert({
        title: "Cuenta bloqueada",
        text: "La cuenta se encuentra bloqueada tras 3 intentos fallidos consecutivos de autenticación.",
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

      await showUserErrorAlert({
        title: "Campos inválidos",
        text: "Por favor, completa correctamente todos los campos obligatorios.",
      });

      return;
    }

    setErrors({});

    try {
      const data = await login(result.data);

      setFailedAttempts(0);
      setIsLocked(false);
      sessionStorage.setItem("token", data.token);

      await showSuccessAlert({
        title: "¡Bienvenido!",
        text: "Has ingresado correctamente a la plataforma.",
        timer: 2000,
      });

      navigate("/dashboard/home");
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);

      const nextAttempts = failedAttempts + 1;
      setFailedAttempts(nextAttempts);

      if (error.code === "ACCOUNT_LOCKED" || nextAttempts >= 3) {
        setIsLocked(true);

        await showUserErrorAlert({
          title: "Cuenta Bloqueada",
          text: "Cuenta bloqueada después de 3 intentos de autenticación erróneos consecutivos.",
        });
      } else {
        const remaining = 3 - nextAttempts;
        await showUserErrorAlert({
          title: "Error de autenticación",
          text: `${error.message || "Credenciales inválidas"}. Te quedan ${remaining} intento(s) antes del bloqueo.`,
        });
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden">
      {/* Imagen de fondo con overlay adaptado a tokens */}
      <img
        src={bf1}
        alt="Fondo de autenticación"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      <div className="absolute inset-0 bg-[var(--color-background-inverse)]/70 backdrop-blur-[2px] z-0" />

      {/* Tarjeta de Login (Material Design 3 Container) */}
      <div className="w-full max-w-md p-6 sm:p-8 md:p-10 bg-[var(--color-background-inverse)] border border-[var(--color-brand)] rounded-3xl relative z-10 shadow-2xl flex flex-col items-center transition-all duration-300">

        {/* Logo */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 mb-4 rounded-full bg-[var(--color-brand)] p-3 flex items-center justify-center shadow-md">
          <img 
            src={logo} 
            alt="Logo Marca" 
            className="w-full h-full object-contain" 
          />
        </div>

        <h1 className="text-title font-[var(--font-heading)] text-[var(--color-brand)] text-center mb-1">
          Iniciar Sesión
        </h1>

        <p className="text-[var(--color-text-muted)] text-caption font-[var(--font-body)] text-center mb-4 max-w-xs">
          Ingresa tus credenciales para acceder a la plataforma
        </p>

        {/* Banner de Estado Bloqueado (MD3 Error Container con tokens de la marca) */}
        {isLocked && (
          <div className="w-full mb-4 p-4 rounded-2xl bg-[var(--color-brand-soft)]/20 border border-[var(--color-brand-soft)] text-center flex flex-col items-center gap-1 shadow-lg animate-fade-in">
            <span className="text-body font-[var(--font-heading)] text-[var(--color-brand-soft)] flex items-center justify-center gap-1">
               Cuenta bloqueada
            </span>
            <span className="text-caption font-[var(--font-body)] text-[var(--color-text-inverse)]">
              Cuenta bloqueada después de 3 intentos de autenticación erróneos consecutivos.
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="gap-5 flex flex-col w-full">
          <Input
            label="Correo Electrónico"
            name="userEmail"
            type="email"
            value={formData.userEmail}
            placeholder="ejemplo@correo.com"
            onChange={handleChange}
            error={errors.userEmail}
            disabled={isLocked}
          />

          <Input
            label="Contraseña"
            name="userPassword"
            type="password"
            value={formData.userPassword}
            placeholder="••••••••••"
            onChange={handleChange}
            error={errors.userPassword}
            disabled={isLocked}
          />

          <div className="text-center">
            <Link 
              to="/forgot-password" 
              className="text-[var(--color-brand)] hover:underline transition-all font-[var(--font-label)] text-caption"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <Button
            variant={isLocked ? "secondary" : "primary"}
            size="md"
            type="submit"
            className="w-full mt-2"
            disabled={isLocked}
          >
            {isLocked ? " Cuenta Bloqueada" : "Iniciar sesión"}
          </Button>

          {errors.submit && (
            <p className="text-[var(--color-brand-soft)] text-caption font-[var(--font-body)] text-center mt-1">
              {errors.submit}
            </p>
          )}

          <div className="text-center text-caption pt-4 border-t border-[var(--color-brand)]/20">
            <span className="text-[var(--color-text-inverse)]/80 font-[var(--font-body)]">¿No tienes cuenta? </span>
            <Link 
              to="/register" 
              className="text-[var(--color-brand)] font-[var(--font-heading)] hover:underline transition-all"
            >
              Regístrate Aquí
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}