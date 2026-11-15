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
          id: data.id,
          dishName: data.dishName || data.nombre || "",
          dishPrice: String(data.dishPrice ?? data.precio ?? ""),
          dishCategory: data.dishCategory || data.categoria || "",
          dishDescription: data.dishDescription || data.descripcion || "",
          dishImageUrl: data.dishImageUrl || data.imagen || null,
          dishImage: [],
          isActive: Boolean(data.isActive ?? data.activo ?? true),
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
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-10 flex flex-col gap-4">
      <div className="flex justify-start">
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
      </div>

      {loading ? (
        <div className="p-8 text-center text-[var(--color-text-inverse)]">
          Cargando datos del platillo...
        </div>
      ) : (
        <DishEditContent
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
        />
      )}
    </section>
  );
}