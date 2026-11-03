import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/shared";
import DishEditContent from "../components/DishEditContent";
import { getDishById, updateDish } from "../services/dishServices";

export default function DishEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDishData = async () => {
      try {
        const data = await getDishById(id);
        setFormData({
          dishName: data.dishName || "",
          dishPrice: String(data.dishPrice || ""),
          dishCategory: data.dishCategory || "",
          dishDescription: data.dishDescription || "",
          dishImage: [],
          isActive: data.isActive ?? true,
        });
      } catch (error) {
        console.error("Error al cargar datos del platillo:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDishData();
  }, [id]);

  const handleSubmit = async (dataToSend) => {
    await updateDish(id, dataToSend);
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-8 md:pt-10 pb-10 flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => navigate(-1)}
          className="!w-auto flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Atrás
        </Button>

        <h1 className="text-xl sm:text-2xl font-bold font-[var(--font-heading)] text-[var(--color-text-inverse)] text-right">
          Editar Platillo
        </h1>
      </div>

      {loading ? (
        <div className="p-8 text-center text-[var(--color-text-inverse)]">
          Cargando datos del platillo...
        </div>
      ) : (
        <DishEditContent
          formData={formData}
          setFormData={setFormData}
          dish={formData}
          onSubmit={handleSubmit}
        />
      )}
    </section>
  );
}