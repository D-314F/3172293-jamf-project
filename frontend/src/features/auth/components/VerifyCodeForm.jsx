// src/features/auth/components/VerifyCodeForm.jsx
import { useState, useRef } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Button } from "@/shared";
import { verifyCodeSchema } from "../schemas/verifyCodeSchema";
import {
  showSuccessAlert,
  showUserErrorAlert,
} from "@/shared/services/alertService";

import bf1 from "@/assets/images/bf-1.png";
import logo from "@/assets/images/1-logo.png";

const PIN_LENGTH = 6;

export default function VerifyCodeForm() {
  const navigate = useNavigate();
  const inputRefs = useRef([]);
  const [digits, setDigits] = useState(Array(PIN_LENGTH).fill(""));
  const [errors, setErrors] = useState({});

  if (sessionStorage.getItem("token")) {
    return <Navigate to="/dashboard/home" replace />;
  }

  const recoveryEmail = sessionStorage.getItem("recoveryEmail") || "";

  const updateDigits = (nextDigits) => {
    setDigits(nextDigits);
    if (errors.code) {
      setErrors({});
    }
  };

  const handleDigitChange = (index, rawValue) => {
    const clean = rawValue.replace(/\D/g, "");
    if (!clean) {
      const next = [...digits];
      next[index] = "";
      updateDigits(next);
      return;
    }

    const next = [...digits];
    next[index] = clean[clean.length - 1];
    updateDigits(next);

    if (index < PIN_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < PIN_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, PIN_LENGTH);

    if (!pasted) return;

    const next = Array(PIN_LENGTH).fill("");
    pasted.split("").forEach((char, idx) => {
      next[idx] = char;
    });
    updateDigits(next);

    const focusIndex = Math.min(pasted.length, PIN_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = digits.join("");
    const result = verifyCodeSchema.safeParse({ code });

    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
      });
      setErrors(fieldErrors);

      await showUserErrorAlert({
        title: "Código incompleto",
        text: "Por favor, ingresa los 6 dígitos numéricos del código PIN.",
      });

      return;
    }

    setErrors({});

    try {
      sessionStorage.setItem("recoveryPin", code);

      await showSuccessAlert({
        title: "Código verificado",
        text: "El código PIN es correcto. Ahora puedes definir tu nueva contraseña.",
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
            onClick={() => navigate("/forgot-password")}
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
              Verificar Código PIN
            </h1>
            <p className="text-[var(--color-text-muted)] text-medium max-w-xs mx-auto">
              {recoveryEmail
                ? `Ingresa el PIN de 6 dígitos enviado a ${recoveryEmail}`
                : "Ingresa el PIN de 6 dígitos que enviamos a tu correo"}
            </p>
          </div>

          {/* 6 casillas PIN interactivas con altura táctil >= 48px (MD3) */}
          <div className="w-full flex flex-col items-center gap-2">
            <div
              className="w-full grid grid-cols-6 gap-2 sm:gap-3"
              onPaste={handlePaste}
            >
              {digits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={1}
                  value={digit}
                  aria-label={`Dígito ${index + 1} del código PIN`}
                  onChange={(e) => handleDigitChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`w-full min-h-[52px] h-13 rounded-xl border text-center text-lg sm:text-xl font-bold font-[var(--font-heading)] bg-[var(--color-background)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)] focus:border-[var(--color-focus-border)] transition-all ${
                    errors.code
                      ? "border-[var(--color-brand-soft)] ring-1 ring-[var(--color-brand-soft)]"
                      : digit
                      ? "border-[var(--color-brand)]"
                      : "border-[var(--color-border)]"
                  }`}
                />
              ))}
            </div>

            {errors.code && (
              <p className="text-medium text-[var(--color-brand-soft)] text-center mt-1">
                {errors.code}
              </p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full min-h-[48px] mt-1 flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            Verificar código PIN
          </Button>
        </form>
      </div>
    </div>
  );
}