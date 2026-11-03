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
    <section className="p-4 sm:p-8 max-w-6xl mx-auto flex flex-col gap-4">
      <div className="flex justify-start">
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