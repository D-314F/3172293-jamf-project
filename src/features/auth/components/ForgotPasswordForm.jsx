import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Button } from "@/shared";
import { forgotPasswordSchema } from "../schemas/forgotPasswordSchema";
import bf1 from "@/assets/images/bf-1.png"; // 👈 misma imagen que el login

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = forgotPasswordSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    alert("enlace enviado correctamente a tu correo");
    navigate("/verify-code");
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
        className="w-full max-w-md p-8 bg-[var(--color-background-inverse)] border border-[var(--color-brand)] rounded-3xl relative z-10 shadow-2xl text-center font-[var(--font-body)]"
      >
        <h1 className="text-[var(--text-title)] font-[var(--font-heading)] text-[var(--color-brand)] text-center mb-2">
          Recuperar Contraseña
        </h1>

        <p className="text-[var(--color-text-secondary)] text-[var(--text-body)] text-center mb-6">
          Ingresa tu correo registrado para recibir el enlace de recuperación
        </p>

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
          className="mt-4 w-full"
        >
          Enviar enlace de recuperación
        </Button>
      </form>
    </div>
  );
}
