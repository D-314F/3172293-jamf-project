import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/shared";
import { ArrowLeft } from "lucide-react";
import UserDetailForm from "../components/UserDetailForm";
import { getUserById } from "../services/userServices";

export default function UserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await getUserById(id);
        setUser(data);
      } catch (error) {
        console.error("Error al obtener detalle del usuario:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [id]);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-10 space-y-6">
      {/* Cabecera M3 idéntica a Editar Usuario */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => navigate("/dashboard/userList")}
            className="!w-auto flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Atrás
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-[var(--font-heading)] text-[var(--color-text-inverse)]">
              Visualizar Usuario
            </h1>
            <p className="text-xs sm:text-sm text-[var(--color-text-muted)]">
              Consulta detallada de identidad, cargo, grupo asignado y datos de contacto
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-[var(--color-text-inverse)]">
          Cargando información del usuario...
        </div>
      ) : (
        <UserDetailForm user={user} />
      )}
    </section>
  );
}