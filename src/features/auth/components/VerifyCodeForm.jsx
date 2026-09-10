import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Button } from "@/shared";
import { verifyCodeSchema } from "../schemas/verifyCodeSchema";
import bf1 from "@/assets/images/bf-1.png"; // 👈 misma imagen que el login

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = verifyCodeSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    alert("Código verificado correctamente");
    navigate("/reset-password");
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
        <h1 className="text-[var(--color-brand)] text-[var(--text-title)] font-[var(--font-heading)] text-center mb-2">
          Verificar Código
        </h1>

        <p className="text-[var(--color-text-secondary)] text-[var(--text-body)] text-center mb-6">
          Ingresa el código que enviamos a tu correo
        </p>

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
          className="mt-4 w-full"
        >
          Verificar
        </Button>
      </form>
    </div>
  );
}
