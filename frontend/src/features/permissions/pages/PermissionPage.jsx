import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/shared";
import { showCancelAlert } from "@/shared/services/alertService";
import PermissionForm from "../components/PermissionForm";

export default function PermissionPage() {
  const navigate = useNavigate();

  const handleBack = async () => {
    const result = await showCancelAlert({
      title: "¿Deseas cancelar?",
      text: "Si sales ahora, perderás los cambios no guardados en los permisos.",
    });

    if (result.isConfirmed) {
      navigate(-1);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-8 md:pt-10 pb-12 flex flex-col gap-6">
      <div className="flex justify-start">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleBack}
          className="!w-auto flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Atrás
        </Button>
      </div>

      <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-text-inverse)] font-[var(--font-heading)]">
        Gestión de permisos
      </h1>

      {/* Formulario principal */}
      <PermissionForm />
    </div>
  );
}