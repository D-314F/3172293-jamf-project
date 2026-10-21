import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/shared";
import PermissionForm from "../components/PermissionForm";

export default function PermissionPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 pt-20 md:pt-28 pb-12 flex flex-col gap-6">
     
      <div className="flex justify-start">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate(-1)}
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