import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Button } from "@/shared";
import { resetPasswordSchema } from "../schemas/resetPasswordSchema";
import bf1 from "@/assets/images/bf-1.png"; // 👈 misma imagen que el login

export default function ResetPasswordForm() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = resetPasswordSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setMessage("Contraseña restablecida correctamente");
    setTimeout(() => navigate("/login"), 2000);
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
        className="bg-[var(--color-background-inverse)] border border-[var(--color-brand)] p-8 rounded-3xl w-full max-w-md text-center shadow-lg font-[var(--font-body)] relative z-10"
      >
        <h2 className="text-[var(--color-brand)] text-[var(--text-title)] font-[var(--font-heading)] mb-2">
          Restablecer Contraseña
        </h2>

        <p className="text-[var(--color-text-secondary)] text-[var(--text-body)] mb-6">
          Ingresa tu nueva contraseña y confírmala para continuar
        </p>

        <Input
          label="Nueva contraseña"
          name="password"
          type="password"
          value={formData.password}
          placeholder="Ingresa tu nueva contraseña"
          onChange={handleChange}
          error={errors.password}
        />

        <Input
          label="Confirmar contraseña"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          placeholder="Confirma tu nueva contraseña"
          onChange={handleChange}
          error={errors.confirmPassword}
        />

        <Button
          type="submit"
          variant="primary"
          size="md"
          className="mt-4 w-full"
        >
          Guardar nueva contraseña
        </Button>

        {message && (
          <p className="text-[var(--color-success)] text-[var(--text-small)] font-bold mt-4">
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
