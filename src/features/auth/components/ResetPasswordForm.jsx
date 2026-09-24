import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
      console.log("Errores de Zod:", result.error.issues);
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
      });
      setErrors(fieldErrors);

      // ALERTA DE ERROR POR CAMPOS INVÁLIDOS O ERRORES DE COINCIDENCIA
      await showUserErrorAlert({
        title: "Campos inválidos",
        text: "Por favor, verifica que la contraseña cumpla los requisitos y coincida.",
      });

      return;
    }

    setErrors({});

    try {
      // Petición al backend si aplica:
      // await resetPassword(formData.password);

      // ALERTA DE ÉXITO ESTANDARIZADA
      await showSuccessAlert({
        title: "Contraseña actualizada",
        text: "Tu contraseña ha sido restablecida correctamente. Redirigiendo...",
        timer: 2000,
      });

      // Redirección al Login
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
          <h2 className="text-[var(--color-brand)] text-[var(--text-title)] font-[var(--font-heading)] text-center mb-2">
            Restablecer Contraseña
          </h2>

          <p className="text-[var(--color-text-secondary)] text-[var(--text-body)] text-center">
            Ingresa tu nueva contraseña y confírmala para continuar
          </p>
        </div>

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
          className="w-full mt-2"
        >
          Guardar nueva contraseña
        </Button>
      </form>
    </div>
  );
}