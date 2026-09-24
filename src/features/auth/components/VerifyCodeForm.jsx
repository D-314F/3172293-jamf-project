import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Button } from "@/shared";
import { verifyCodeSchema } from "../schemas/verifyCodeSchema";
import { 
  showSuccessAlert, 
  showUserErrorAlert 
} from "@/shared/services/alertService";

import bf1 from "@/assets/images/bf-1.png";

export default function VerifyCodeForm() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    code: "",
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
    const result = verifyCodeSchema.safeParse(formData);

    if (!result.success) {
      console.log("Errores de Zod:", result.error.issues);
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
      });
      setErrors(fieldErrors);

      // ALERTA DE ERROR POR CÓDIGO INVÁLIDO EN FORMULARIO
      await showUserErrorAlert({
        title: "Código inválido",
        text: "Por favor, ingresa un código de verificación válido.",
      });

      return;
    }

    setErrors({});

    try {
      // Petición al backend si aplica:
      // await verifyCode(formData.code);

      // ALERTA DE ÉXITO ESTANDARIZADA
      await showSuccessAlert({
        title: "Código verificado",
        text: "El código es correcto. Ahora puedes restablecer tu contraseña.",
        timer: 2000,
      });

      // Redirección al cambio de contraseña
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
          <h1 className="text-[var(--color-brand)] text-[var(--text-title)] font-[var(--font-heading)] text-center mb-2">
            Verificar Código
          </h1>

          <p className="text-[var(--color-text-secondary)] text-[var(--text-body)] text-center">
            Ingresa el código que enviamos a tu correo
          </p>
        </div>

        <Input
          label="Código de verificación"
          name="code"
          type="text"
          value={formData.code}
          placeholder="Escribe el código"
          onChange={handleChange}
          error={errors.code}
        />

        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full mt-2"
        >
          Verificar
        </Button>
      </form>
    </div>
  );
}