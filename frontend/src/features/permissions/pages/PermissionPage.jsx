import PermissionForm from "../components/PermissionForm";
import Button from "@/shared/components/Button";
import { useNavigate } from "react-router-dom";

export default function PermissionPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full px-8 pt-24 pb-12">
      {/* Botón Atrás */}
      <div className="flex justify-start mb-6">
        <Button variant="secondary" size="sm" onClick={() => navigate(-1)}>
          Atrás
        </Button>
      </div>

      {/* Título */}
      <h1 className="text-[var(--color-text-inverse)] font-[var(--font-heading)] text-xl mb-8">
        Gestión de permisos
      </h1>

      {/* Formulario principal */}
      <PermissionForm />
    </div>
  );
}