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
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-10 space-y-6">
      {/* Cabecera MD3 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            type="button"
            onClick={handleBack}
          >
            <ArrowLeft className="w-4 h-4" />
            Atrás
          </Button>
          <div>
            <h1 className="text-main font-[var(--font-heading)] text-[var(--color-text-inverse)]">
              Gestión de Permisos
            </h1>
            <p className="text-medium text-[var(--color-text-muted)]">
              Configuración granular de acceso por rol o usuario individual
            </p>
          </div>
        </div>
      </div>

      {/* Formulario principal */}
      <PermissionForm />
    </section>
  );
}
