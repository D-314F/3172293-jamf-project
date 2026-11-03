import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/shared";
import DishViewContent from "../components/DishViewContent";
import { getDishById } from "../services/dishServices";

export default function DishViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dish, setDish] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDish = async () => {
      try {
        const data = await getDishById(id);
        setDish(data);
      } catch (error) {
        console.error("Error al cargar el platillo:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDish();
  }, [id]);

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-8 md:pt-10 pb-10 flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => navigate("/dashboard/dishList")}
          className="!w-auto flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Atrás
        </Button>

        <h1 className="text-xl sm:text-2xl font-bold font-[var(--font-heading)] text-[var(--color-text-inverse)] text-right">
          Visualizar Platillo
        </h1>
      </div>

      {loading ? (
        <div className="p-8 text-center text-[var(--color-text-inverse)]">
          Cargando información del platillo...
        </div>
      ) : (
        <DishViewContent dish={dish || {}} />
      )}
    </section>
  );
}